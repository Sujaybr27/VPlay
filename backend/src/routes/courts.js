// backend/src/routes/courts.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireLocationOwner } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all courts with slots
router.get('/', async (req, res) => {
  try {
    const courts = await prisma.court.findMany({
      include: { slots: true, location: true },
    });
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a court (location owner only)
router.post('/', authenticateToken, async (req, res) => {
  const { name, sport, description, maxPlayers, price, locationId } = req.body;

  try {
    // Check if user owns the location
    const location = await prisma.location.findUnique({
      where: { id: locationId }
    });
    
    if (!location || (location.ownerId !== req.user.id && !req.user.isAdmin)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const court = await prisma.court.create({
      data: { name, sport, description, maxPlayers, price, locationId },
    });
    res.json(court);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get courts for a specific location (owner)
router.get('/location/:locationId', authenticateToken, requireLocationOwner, async (req, res) => {
  try {
    const courts = await prisma.court.findMany({
      where: { locationId: parseInt(req.params.locationId) },
      include: { slots: true }
    });
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
