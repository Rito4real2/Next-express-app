// client/src/components/ConditionalNavbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AdminNavbar from '@/components/AdminNavbar'; // Import your Admin Navbar

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Check if current route starts with /admin
  const isAdminRoute = pathname.startsWith('/admin') || 
    pathname.startsWith('/admin/dashboard') || 
    pathname.startsWith('/admin/settings') || 
    pathname.startsWith('/users/manage') || 
    pathname.startsWith('/users/manage/transactions') ||
    pathname.startsWith('/admin/settings/payment-details');

  // Render AdminNavbar for admin routes, standard Navbar for everything else
  if (isAdminRoute) {
    return <AdminNavbar />;
  }

  return <Navbar />;
}