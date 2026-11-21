import { Router, Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

const router = Router();

// POST analyze an issue report (used live during form typing or submission)
router.post('/analyze', (req: Request, res: Response) => {
  const { title = '', description = '', location, categoryHint } = req.body;

  if (!title.trim() && !description.trim()) {
    return res.status(400).json({ error: 'Title or description required for AI analysis' });
  }

  const analysis = AIService.analyzeReport(
    title,
    description,
    location,
    categoryHint
  );

  return res.json({ analysis });
});

// POST verify resolution notes against initial complaint
router.post('/verify-resolution', (req: Request, res: Response) => {
  const { description = '', resolutionNotes = '' } = req.body;

  const result = AIService.verifyResolutionSuitability(
    description,
    resolutionNotes
  );

  return res.json({ result });
});

export default router;
