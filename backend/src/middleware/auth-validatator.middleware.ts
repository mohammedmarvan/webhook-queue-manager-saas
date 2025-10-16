import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import jwt from 'jsonwebtoken';

export function authValidator(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Missing token' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = decoded; // attach user info to request
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } catch (err) {
    logger.error('Error in authValidator middleware', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
