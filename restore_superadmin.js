const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.create({
    data: {
      name: "Amit Halder",
      email: "amith7319@gmail.com",
      role: "SUPERADMIN"
    }
  });
  console.log("Restored SUPERADMIN");
}
main().catch(console.error).finally(() => prisma.$disconnect());
