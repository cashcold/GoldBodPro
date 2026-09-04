import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../server/config/db.js';
import apiRoutes, { seedMongoDbIfEmpty } from '../server/routes/api.js';

// Load environment variables if available
dotenv.config();

const app = express();

// Middlewares & CORS Configuration for Vercel Serverless
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.options('*', cors());

// CORS preflight headers
app.use((req: Request, res: Response, next: NextFunction) => {
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

// Ensure DB connection is established for serverless invocation
let dbInitialized = false;
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    if (mongoose.connection.readyState === 1 && !dbInitialized) {
      dbInitialized = true;
      seedMongoDbIfEmpty().catch(() => {});
    }
  } catch (err) {
    console.warn('[Vercel Serverless] DB connection warning:', err);
  }
  next();
});

// Normalize request URL if Vercel strips /api or rewrites path
app.use((req: Request, res: Response, next: NextFunction) => {
  const original = req.originalUrl || req.url;
  if ((req.url === '/' || req.url === '/api' || req.url === '') && original && original !== '/' && original !== '/api') {
    req.url = original;
  }
  next();
});

// Health check endpoint
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: 'vercel-serverless',
    dbReady: mongoose.connection.readyState === 1,
    time: new Date().toISOString()
  });
});

// Mount routes at both /api and / so rewritten or non-rewritten paths both match
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Database offline error fallback middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.name === 'MongooseError' || err?.name === 'MongoNetworkError' || err?.message?.includes('buffering timed out')) {
    console.warn('[Vercel Serverless] Database offline — fallback handling');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  console.error('[Vercel Serverless Error]:', err);
  res.status(500).json({ error: err?.message || 'Internal Server Error' });
});

export default app;
