// backend/src/routes/slots.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create multiple slots for a court
router.post('/bulk', async (req, res) => {
  const { slots } = req.body;

  try {
    const createdSlots = await prisma.slot.createMany({
      data: slots,
    });

    res.json(createdSlots);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generate slots for a court
router.post('/generate/:courtId', async (req, res) => {
  const { courtId } = req.params;
  
  try {
    const slots = [];
    const now = new Date();
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 6; hour < 22; hour++) {
        const start = new Date(now);
        start.setDate(now.getDate() + day);
        start.setHours(hour, 0, 0, 0);
        
        const end = new Date(start);
        end.setHours(hour + 1, 0, 0, 0);
        
        slots.push({
          start,
          end,
          courtId: parseInt(courtId)
        });
      }
    }

    await prisma.slot.createMany({ data: slots });
    res.json({ message: 'Slots generated successfully', count: slots.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get slots for a specific court
router.get('/court/:courtId', async (req, res) => {
  const { courtId } = req.params;

  try {
    const slots = await prisma.slot.findMany({
      where: { courtId: parseInt(courtId) },
      orderBy: { start: 'asc' },
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;