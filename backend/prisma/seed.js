import { PrismaClient } from '@prisma/client';
import { encryptPassword } from '../src/utils/crypto.js';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  let user = await prisma.user.findUnique({ where: { email: 'test@vplay.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@vplay.com',
        password: 'temp',
        isAdmin: false,
      },
    });
    const encrypted = encryptPassword('password', user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: encrypted }
    });
  }

  // Create a location owner (admin)
  let owner = await prisma.user.findUnique({ where: { email: 'owner@vplay.com' } });
  if (!owner) {
    owner = await prisma.user.create({
      data: {
        name: 'Location Owner',
        email: 'owner@vplay.com',
        password: 'temp',
        isAdmin: true,
      },
    });
    const encrypted = encryptPassword('password', owner.id);
    await prisma.user.update({
      where: { id: owner.id },
      data: { password: encrypted }
    });
  }

  // Create a location
  const location = await prisma.location.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Play Arena Bangalore',
      address: 'Sarjapur Road, Bangalore',
      ownerId: owner.id,
    },
  });

  // Create a Badminton court
  const badmintonCourt = await prisma.court.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Badminton Court 1',
      sport: 'Badminton',
      description: 'Indoor synthetic court',
      maxPlayers: 4,
      price: 300,
      locationId: location.id,
    },
  });

  // Create a Cricket pitch
  const cricketCourt = await prisma.court.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Cricket Pitch 1',
      sport: 'Cricket',
      description: 'Outdoor turf pitch',
      maxPlayers: 22,
      price: 1200,
      locationId: location.id,
    },
  });

  // Add slots for Badminton (1 hour each)
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const start = new Date(now.getTime() + i * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    await prisma.slot.create({
      data: {
        start,
        end,
        courtId: badmintonCourt.id,
      },
    });
  }

  // Add slots for Cricket (3 hours each)
  for (let i = 0; i < 3; i++) {
    const start = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    await prisma.slot.create({
      data: {
        start,
        end,
        courtId: cricketCourt.id,
      },
    });
  }

  console.log(`🌱 Database has been seeded.
  ➜ Test user: test@vplay.com
  ➜ Location owner: owner@vplay.com`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
