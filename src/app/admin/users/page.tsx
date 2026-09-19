import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserActions from './UserActions';
import AddUserForm from './AddUserForm';
import Pagination from '@/components/Pagination';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;

  // Only SUPERADMIN can access this page
  if (role !== 'SUPERADMIN') {
    redirect('/admin');
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const take = 20;
  const skip = (currentPage - 1) * take;

  const whereClause = {
    role: {
      not: 'PATIENT' as const
    }
  };

  const totalUsers = await prisma.user.count({
    where: whereClause
  });

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'desc',
    },
    take,
    skip,
  });

  const totalPages = Math.ceil(totalUsers / take);

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-salute-dark font-heading">User Management</h1>
            <p className="text-gray-500 mt-1">Manage staff and patient access</p>
          </div>
          <div className="text-sm font-bold text-salute-primary bg-salute-accent px-4 py-2 rounded-lg">
            {users.length} Users
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add User Form */}
          <div className="lg:col-span-1">
            <AddUserForm />
          </div>

          {/* Users Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Joined On</th>
                      <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5">
                          {user.name && <p className="font-bold text-salute-dark">{user.name}</p>}
                          <p className={`text-salute-dark ${user.name ? 'text-xs text-gray-500 mt-0.5' : 'font-bold'}`}>{user.email}</p>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'RECEPTION' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-5">
                          <p className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="p-5 text-right">
                          <UserActions userId={user.id} currentRole={user.role} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
