import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { runMigrations } from './db/migrations';
import { runSeed } from './db/seed';
import authRouter from './routes/authRoutes';
import publicRouter from './routes/publicRoutes';
import adminRouter from './routes/adminRoutes';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'alan@alananaya.dev';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'buildgreatapps';

const bootstrap = async () => {
  runMigrations();
  await runSeed(ADMIN_EMAIL, ADMIN_PASSWORD);

  const app = express();
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(morgan('dev'));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', publicRouter);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`API server ready on http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server', error);
  process.exit(1);
});
