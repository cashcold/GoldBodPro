import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Fast fail for bufferCommands so requests don't hang if DB is offline
mongoose.set('bufferCommands', false);

export const dbStatusInfo = {
  attempted: false,
  connected: false,
  state: 'disconnected',
  targetDb: 'PrimeGoldResources',
  host: '',
  uriFound: false,
  maskedUri: '',
  activeUri: '',
  lastError: null as string | null,
  lastAttemptAt: '',
  userCount: 0
};

export function getMongoUri(): string | null {
  // Read .env or .env.example FIRST so file updates take immediate priority
  const candidatePaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.example')
  ];

  for (const envPath of candidatePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        // Match MONGODB_URI=mongodb... or MONGODB_URImongodb... or MONGODB_URI:mongodb...
        const match = content.match(/MONGODB_URI\s*[=:]?\s*(mongodb(?:\+srv)?:\/\/[^\r\n\s"']+)/i);
        if (match && match[1]?.trim()) {
          const found = match[1].trim();
          process.env.MONGODB_URI = found;
          return found;
        }
      }
    } catch (e) {}
  }

  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) return process.env.MONGODB_URI.trim();
  if (process.env.MONGO_URI && process.env.MONGO_URI.trim()) return process.env.MONGO_URI.trim();

  return null;
}

export function formatMongoUri(rawUri: string): { formattedUri: string; dbName: string } {
  let uri = rawUri.trim().replace(/^["']|["']$/g, '');
  
  let dbName = 'PrimeGoldResources';

  // Check if a specific database is specified in path (e.g. mongodb.net/PrimeGoldResources?...)
  const pathMatch = uri.match(/mongodb(?:\+srv)?:\/\/[^/]+\/([^?/\s]+)/i);
  if (pathMatch && pathMatch[1] && pathMatch[1].trim()) {
    const extracted = pathMatch[1].trim();
    if (extracted.toLowerCase() !== 'capgainco' && extracted.toLowerCase() !== 'admin' && extracted.toLowerCase() !== 'test') {
      dbName = extracted;
    }
  }

  // Ensure URI has the target db in the connection string path
  if (uri.includes('.mongodb.net/')) {
    uri = uri.replace(/\.mongodb\.net\/([^?]*)/, (match, currentDb) => {
      if (!currentDb || currentDb.trim() === '' || currentDb.toLowerCase() === 'capgainco') {
        return `.mongodb.net/${dbName}`;
      }
      return `.mongodb.net/${dbName}`;
    });
  } else if (uri.includes('.mongodb.net?')) {
    uri = uri.replace('.mongodb.net?', `.mongodb.net/${dbName}?`);
  } else if (uri.endsWith('.mongodb.net') || uri.endsWith('.mongodb.net/')) {
    uri = uri.replace(/\.mongodb\.net\/?$/, `.mongodb.net/${dbName}?retryWrites=true&w=majority`);
  }

  // Ensure appName parameter is PrimeGoldResources, not Capgainco
  if (uri.includes('appName=')) {
    uri = uri.replace(/appName=[^&]+/i, `appName=${dbName}`);
  } else {
    uri += (uri.includes('?') ? '&' : '?') + `appName=${dbName}`;
  }

  return { formattedUri: uri, dbName };
}

let isConnecting = false;

export async function connectDB(forceReconnect = false) {
  const rawMongoUri = getMongoUri();
  dbStatusInfo.attempted = true;
  dbStatusInfo.lastAttemptAt = new Date().toISOString();
  
  if (rawMongoUri) {
    dbStatusInfo.uriFound = true;
    const { formattedUri, dbName } = formatMongoUri(rawMongoUri);
    dbStatusInfo.targetDb = dbName;
    // Mask password for display
    dbStatusInfo.maskedUri = formattedUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

    // If already connected and not forcing reconnect, reuse existing connection (vital for serverless cold/warm starts)
    if (mongoose.connection.readyState === 1 && !forceReconnect) {
      dbStatusInfo.connected = true;
      dbStatusInfo.state = 'connected';
      dbStatusInfo.host = mongoose.connection.host || 'MongoDB Atlas';
      dbStatusInfo.activeUri = formattedUri;
      dbStatusInfo.lastError = null;
      return true;
    }

    // If currently connecting in another concurrent request, wait for it to complete
    if ((mongoose.connection.readyState as number) === 2) {
      let waited = 0;
      while ((mongoose.connection.readyState as number) === 2 && waited < 25) {
        await new Promise(r => setTimeout(r, 100));
        waited++;
      }
      if ((mongoose.connection.readyState as number) === 1) {
        dbStatusInfo.connected = true;
        dbStatusInfo.state = 'connected';
        dbStatusInfo.host = mongoose.connection.host || 'MongoDB Atlas';
        dbStatusInfo.activeUri = formattedUri;
        dbStatusInfo.lastError = null;
        return true;
      }
    }

    if (isConnecting) return false;
    isConnecting = true;

    try {
      if (mongoose.connection.readyState !== 0) {
        console.log('🔄 Disconnecting from previous database connection to connect to updated MongoDB URI...');
        await mongoose.disconnect();
      }

      console.log(`🔌 [MongoDB Atlas] Connecting to live database "${dbName}"...`);
      await mongoose.connect(formattedUri, { 
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        dbName: dbName
      });

      dbStatusInfo.connected = true;
      dbStatusInfo.state = 'connected';
      dbStatusInfo.activeUri = formattedUri;
      dbStatusInfo.host = mongoose.connection.host || 'MongoDB Atlas';
      dbStatusInfo.lastError = null;

      console.log(`✅ [MongoDB Atlas] Connected successfully to database: "${dbName}" on host: ${dbStatusInfo.host}`);
      isConnecting = false;
      return true;
    } catch (err: any) {
      dbStatusInfo.connected = false;
      dbStatusInfo.state = 'connection_error';
      dbStatusInfo.lastError = err?.message || String(err);
      console.warn('⚠️ [MongoDB Atlas] Connection attempt failed. Error details:', dbStatusInfo.lastError);
      isConnecting = false;
      return false;
    }
  } else {
    dbStatusInfo.uriFound = false;
    dbStatusInfo.state = 'no_uri';
    console.log('ℹ️ No MONGODB_URI detected in .env.');
    return false;
  }
}

// Auto-reconnect listeners
mongoose.connection.on('disconnected', () => {
  dbStatusInfo.connected = false;
  dbStatusInfo.state = 'disconnected';
  console.log('⚠️ [MongoDB Atlas] Connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  dbStatusInfo.connected = false;
  dbStatusInfo.state = 'error';
  dbStatusInfo.lastError = err?.message || String(err);
  console.error('⚠️ [MongoDB Atlas Error]:', err);
});



