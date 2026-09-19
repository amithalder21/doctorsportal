const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Get any SUPERADMIN
  const admin = await prisma.user.findFirst({ where: { role: 'SUPERADMIN' } });
  if (!admin) return console.log("No superadmin found.");
  
  // 2. Try to create an audit log manually
  try {
    const log = await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: 'TEST_ACTION',
        targetId: 'TEST_TARGET',
      }
    });
    console.log("Successfully created log:", log);
  } catch (e) {
    console.error("Failed to create log:", e);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
