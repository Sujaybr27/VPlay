import { PrismaClient } from '@prisma/client';
import { encryptPassword } from './src/utils/crypto.js';

const prisma = new PrismaClient();

async function resetPassword(email, newPassword) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error('❌ User not found');
      return;
    }
    
    const encrypted = encryptPassword(newPassword, user.id);
    
    await prisma.user.update({
      where: { email },
      data: { password: encrypted }
    });
    
    console.log(`✅ Password reset for ${email}`);
    console.log(`New password: ${newPassword}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Usage: node reset-user-password.js
// Change these values as needed:
const EMAIL = 'test@vplay.com';
const NEW_PASSWORD = 'newpassword123';

resetPassword(EMAIL, NEW_PASSWORD);