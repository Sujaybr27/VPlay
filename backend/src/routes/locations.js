// backend/src/routes/locations.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all locations with courts
router.get('/', async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      include: { courts: true },
    });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new location (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, address, ownerId } = req.body;

  try {
    const location = await prisma.location.create({
      data: { name, address, ownerId },
    });
    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get locations owned by current user
router.get('/my-locations', authenticateToken, async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      where: { ownerId: req.user.id },
      include: { courts: true }
    });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
