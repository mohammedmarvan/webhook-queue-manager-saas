import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/:projectIdentifier/:sourceIdentifier', (req: Request, res: Response, next: NextFunction) => {
  const { projectIdentifier, sourceIdentifier } = req.params;
  console.log('projectIdentifier ',projectIdentifier);
  console.log('sourceIdentifier ',sourceIdentifier);

  try {

  }catch(e) {
    
  }

  res.json({ ok: true });
});

export default router;