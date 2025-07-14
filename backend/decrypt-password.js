import { PrismaClient } from '@prisma/client';
import { decryptPassword } from './src/utils/crypto.js';

const prisma = new PrismaClient();

async function decrypt(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('❌ User not found');
      return;
    }
    
    const decrypted = decryptPassword(user.password, user.id);
    console.log(`✅ Password for ${email}: ${decrypted}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node decrypt-password.js
const EMAIL = 'test@vplay.com';
decrypt(EMAIL);