import { Router, Request, Response, NextFunction } from 'express';
import handleIncomingController from '../controllers/handle-Incoming.controller';
import { tryCatch } from '../utils/try-catch';
import logger from '../config/logger';

const router = Router();

router.post(
  '/:projectIdentifier/*sourceIdentifier',
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectIdentifier, sourceIdentifier } = req.params;
    const sourceIdentifierString = Array.isArray(sourceIdentifier)
      ? sourceIdentifier.join('/')
      : sourceIdentifier;

    const { data, error } = await tryCatch(
      handleIncomingController(req, projectIdentifier, sourceIdentifierString),
    );

    if (error) {
      logger.error(`Error in incoming request handler  `, error);
      res.json({ status: false, message: `Something went wrong` }).send();
      return;
    }

    res.json({ status: true, eventId: data });
  },
);

export default router;
