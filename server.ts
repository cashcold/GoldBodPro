import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.js';
import apiRoutes from './server/routes/api.js';

dotenv.config();

async function startServer() {
  const app = express();
  
  // 1. Bind dynamically to Heroku's PORT env variable
  const PORT = process.env.PORT || 3000;

  // Connect Database
  await connectDB();

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.use('/api', apiRoutes);

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
    // 2. Serve Vite output assets in production
    const clientDistPath = path.join(process.cwd(), 'dist', 'client');
    const fallbackDistPath = path.join(process.cwd(), 'dist');

    app.use(express.static(clientDistPath));
    app.use(express.static(fallbackDistPath));

    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
        if (err) {
          res.sendFile(path.join(fallbackDistPath, 'index.html'));
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GoldBod Pro Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start GoldBod Pro server:', err);
});