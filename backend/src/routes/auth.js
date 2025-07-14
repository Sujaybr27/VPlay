// backend/src/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { encryptPassword, decryptPassword } from '../utils/crypto.js';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user first to get ID
    const user = await prisma.user.create({
      data: { name, email, password: 'temp' },
    });

    // Encrypt password with user ID and update
    const encrypted = encryptPassword(password, user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: encrypted }
    });

    res.json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const decrypted = decryptPassword(user.password, user.id);
    if (decrypted !== password) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // In a real app, you would verify the Google token here
    // For demo purposes, we'll create a mock user
    const email = 'google-user@example.com';
    const name = 'Google User';
    
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: { name, email, password: null },
      });
    }
    
    const jwtToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
