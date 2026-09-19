const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const logs = await prisma.auditLog.findMany();
  console.log("Total logs in DB:", logs.length);
  if (logs.length > 0) {
    console.log("Most recent log:", logs[logs.length - 1]);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
