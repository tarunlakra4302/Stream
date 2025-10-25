import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Navbar from '@/components/Navbar';
import { auth } from '@/lib/auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  // Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;