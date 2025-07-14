import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

export const requireLocationOwner = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const location = await prisma.location.findUnique({
      where: { id: parseInt(locationId) }
    });
    
    if (!location || (location.ownerId !== req.user.id && !req.user.isAdmin)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};