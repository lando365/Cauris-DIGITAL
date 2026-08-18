import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? 'Administrateur CAURIS';

  if (!email || !password) {
    throw new Error(
      'SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD doivent être définis (dans .env.local) pour lancer le seed.'
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Un compte existe déjà pour ${email}, seed ignoré.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, name, passwordHash, role: 'ADMIN' },
  });

  console.log(`Compte ADMIN créé : ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
