// backend/src/routes/bookings.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        slot: { 
          include: { 
            court: { 
              include: { location: true } 
            } 
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Book a slot
router.post('/', async (req, res) => {
  const { userId, slotId } = req.body;

  try {
    // Check if slot is already booked
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    if (slot.isBooked) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    const booking = await prisma.booking.create({
      data: { userId, slotId },
      include: {
        slot: { 
          include: { 
            court: { 
              include: { location: true } 
            } 
          } 
        },
      },
    });

    await prisma.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get bookings for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: parseInt(userId) },
      include: {
        slot: { 
          include: { 
            court: { 
              include: { location: true } 
            } 
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
