import { Prisma } from '@prisma/client';
import { Response } from 'express';
import logger from '../config/logger';

export function handleDbError(res: Response, error: unknown, action: string) {
  logger.error(`DB Error during ${action}`, error);

  // Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint
        return res.status(400).json({
          status: false,
          message: `Duplicate value for field(s): ${error.meta?.target}`,
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          status: false,
          message: `Record not found while trying to ${action}`,
        });
      default:
        return res.status(400).json({
          status: false,
          message: `Database error while trying to ${action}`,
        });
    }
  }

  // Fallback for unknown errors
  return res.status(500).json({
    status: false,
    message: `Unexpected error while trying to ${action}`,
  });
}
