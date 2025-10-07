import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { requestLogger } from './middleware/apiValidator';
import api from './routes';
import { AppError } from './errors/appError';

const app = express();

app.use(express.json());

app.use(requestLogger);
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
  
    console.error('Unexpected Error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  });


export default app;
