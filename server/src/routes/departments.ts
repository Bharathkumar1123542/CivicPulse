import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// GET all departments
router.get('/departments', (_req: Request, res: Response) => {
  const departments = db.getDepartments();
  const users = db.getUsers();

  // Attach officers list to each department
  const enriched = departments.map((d) => {
    const officers = users
      .filter((u) => u.role === 'officer' && u.departmentId === d.id)
      .map(({ password, ...u }) => u);
    return {
      ...d,
      officers,
    };
  });

  return res.json({ departments: enriched });
});

// GET all categories
router.get('/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  return res.json({ categories });
});

export default router;
