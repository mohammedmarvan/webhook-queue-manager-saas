import { Router, Request, Response, NextFunction } from 'express';

import incomingRoutesHandler from './incoming.routes';
import { NotFoundError } from '../errors/notFoundError';

const router = Router();

router.use('/incoming', incomingRoutesHandler);

router.use((req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
})

export default router;