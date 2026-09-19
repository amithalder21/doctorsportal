import { cookies } from 'next/headers';
import AdminNav from '@/components/AdminNav';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value || null;
  const adminId = cookieStore.get('admin_id')?.value;
  
  let adminName = 'Admin';
  if (adminId) {
    const user = await prisma.user.findUnique({ where: { id: adminId } });
    if (user && user.name) {
      adminName = user.name;
    }
  }

  return (
    <div className="min-h-screen bg-salute-light flex flex-col">
      <AdminNav role={role} name={adminName} />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
