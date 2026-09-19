import { cookies } from 'next/headers';
import ScheduleManager from '@/components/ScheduleManager';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value || null;
  const adminId = cookieStore.get('admin_id')?.value || null;

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-salute-dark font-heading">Schedule & Leaves</h1>
        <p className="text-gray-500 mt-1 mb-10">
          Manage your availability, mark holidays, and block out specific time slots.
        </p>
        
        <ScheduleManager role={role} adminId={adminId} />
      </div>
    </div>
  );
}
