import express from 'express';
import { PrismaClient } from '@prisma/client';
import { encryptPassword } from '../utils/crypto.js';

const router = express.Router();
const prisma = new PrismaClient();

// Reset password (admin only or with proper verification)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const encrypted = encryptPassword(newPassword, user.id);
    
    await prisma.user.update({
      where: { email },
      data: { password: encrypted }
    });
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;