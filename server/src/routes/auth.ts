import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { User, UserRole } from '../types.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'civicpulse_secret_jwt_key_2026';

export function authenticate(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized, token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    const user = db.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Register
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password, role = 'citizen', phone, departmentId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  let departmentName: string | undefined;
  if (departmentId) {
    const dept = db.findDepartmentById(departmentId);
    if (dept) departmentName = dept.name;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // in real production bcrypt is used
    role,
    phone,
    departmentId,
    departmentName,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250`,
    createdAt: new Date().toISOString(),
  };

  db.createUser(newUser);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPass } = newUser;
  return res.json({ token, user: userWithoutPass });
});

// Login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPass } = user;
  return res.json({ token, user: userWithoutPass });
});

// Quick demo role switch for portfolio demonstration
router.post('/demo-switch', (req: Request, res: Response) => {
  const { role = 'citizen' } = req.body;

  let targetEmail = 'vandhana@citizen.org';
  if (role === 'officer') {
    targetEmail = 'officer.rajesh@civicpulse.gov';
  } else if (role === 'admin') {
    targetEmail = 'admin@civicpulse.gov';
  }

  const user = db.findUserByEmail(targetEmail) || db.getUsers().find((u) => u.role === role);
  if (!user) {
    return res.status(404).json({ error: `Demo user for role ${role} not found` });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { password: _, ...userWithoutPass } = user;
  return res.json({ token, user: userWithoutPass });
});

// Get Current User Profile
router.get('/me', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass });
});

export default router;
