import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error('Define ADMIN_EMAIL y una ADMIN_PASSWORD de al menos 12 caracteres antes de crear el administrador.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.ADMIN, isActive: true },
    create: { name: 'Administrador NAS', email, passwordHash, role: Role.ADMIN }
  });
}

main().finally(() => prisma.$disconnect());
