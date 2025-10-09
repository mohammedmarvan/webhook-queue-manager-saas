import { Router, Request, Response, NextFunction } from 'express';

import incomingRoutesHandler from './incoming.routes';
import { NotFoundError } from '../errors/not-found-error';
import appRouts from './app.routes';
import { authValidator } from '../middleware/auth-validatator.middleware';

const router = Router();

router.use('/incoming', incomingRoutesHandler);
router.use('/api', authValidator, appRouts);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

export default router;
