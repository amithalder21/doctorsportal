const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dateParam = null;
  let startDate;
  let endDate;

  if (dateParam) {
    startDate = new Date(`${dateParam}T00:00:00+05:30`);
  } else {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
    const istDateString = now.toLocaleDateString('en-CA', options);
    
    startDate = new Date(`${istDateString}T00:00:00+05:30`);
  }

  endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);
  
  console.log("StartDate:", startDate);
  console.log("EndDate:", endDate);

  const logs = await prisma.auditLog.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    }
  });

  console.log("Logs found:", logs.length);
}

main().catch(console.error).finally(() => prisma.$disconnect());
