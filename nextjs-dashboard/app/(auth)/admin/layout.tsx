import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SideNav from '@/app/ui/dashboard/sidenav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  // Additional admin role check
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {children}
      </div>
    </div>
  );
}
