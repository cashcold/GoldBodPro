import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.js';
import apiRoutes, { seedMongoDbIfEmpty } from './server/routes/api.js';

// Load .env and override any existing process.env values
dotenv.config({ override: true });

async function startServer() {
  const app = express();
  
  const PORT = Number(process.env.PORT) || 3000;

  // Connect Database and seed initial master data
  await connectDB();
  if (mongoose.connection.readyState === 1) {
    await seedMongoDbIfEmpty().catch(() => {});
  }

  // Middlewares & Full CORS Configuration
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }));
  app.options('*', cors());

  // Additional CORS headers for strict proxy / hosting environments
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Ensure database is live before processing API requests
  app.use('/api', async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      connectDB().catch(() => {});
    }
    next();
  });

  // API Routes
  app.use('/api', apiRoutes);

  // Database offline error fallback middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err?.name === 'MongooseError' || err?.name === 'MongoNetworkError' || err?.message?.includes('buffering timed out')) {
      console.warn('[AI Studio] Database offline — fallback handling');
      if (req.method === 'GET') {
        return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
      }
      return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
    }
    next(err);
  });

  // Serve static uploads or media if any
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Vite middleware in dev mode vs static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GoldBod Pro Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start GoldBod Pro server:', err);
});