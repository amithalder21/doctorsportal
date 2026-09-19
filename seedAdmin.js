const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'amith7319@gmail.com';
  
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'SUPERADMIN',
    },
    create: {
      email,
      role: 'SUPERADMIN',
    },
  });

  console.log('Seeded User:', user);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
