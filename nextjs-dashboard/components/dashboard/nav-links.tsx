'use client';

import {
  HomeIcon,
  ShoppingCartIcon,
  CalendarIcon,
  UserGroupIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const baseLinks = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'My Rentals', href: '/dashboard/rentals', icon: ShoppingCartIcon },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarIcon },
];

const adminLinks = [
  { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userId) {
      // Check user role
      fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.role === 'admin');
        })
        .catch(console.error);
    }
  }, [userId]);

  // Combine links based on user role
  const links = [...baseLinks, ...(isAdmin ? adminLinks : [])];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-[#235082] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LinkIcon className={`h-6 w-6 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            <span className="truncate">{link.name}</span>
            {isActive && (
              <div className="absolute left-0 h-full w-1 bg-[#235082] rounded-r" />
            )}
          </Link>
        );
      })}
    </>
  );
}
