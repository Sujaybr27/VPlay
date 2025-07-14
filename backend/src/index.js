// backend/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';
import courtRoutes from './routes/courts.js';
import bookingRoutes from './routes/bookings.js';
import locationRoutes from './routes/locations.js';
import slotRoutes from './routes/slots.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

console.log('🔍 Prisma client initialized');

// Test database connection
prisma.$connect().then(() => {
  console.log('✅ Database connected successfully');
}).catch((error) => {
  console.error('❌ Database connection failed:', error);
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/slots', slotRoutes);

app.get('/ping', (req, res) => res.send('pong'));

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
