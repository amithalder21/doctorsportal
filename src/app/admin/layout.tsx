import { cookies } from 'next/headers';
import AdminNav from '@/components/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value || null;

  return (
    <div className="min-h-screen bg-salute-light flex flex-col">
      <AdminNav role={role} />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
