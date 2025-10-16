import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { requestLogger } from './middleware/api-validator.middleware';
import api from './routes';
import authRoutes from './routes/auth.routes';
import { AppError } from './errors/app-error';
import logger from './config/logger';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:4000' }));
app.use(express.json());

app.use(requestLogger);

app.use('/api/auth', authRoutes);

app.use(api);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  logger.error(`Unexpected error `, err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

export default app;
