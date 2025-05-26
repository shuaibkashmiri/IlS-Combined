'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function InstructorLayout({ children }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (!user) {
  //     router.push('/banglore');
  //   } else if (user.role !== 'instructor') {
  //     router.push('/banglore');
  //   }
  // }, [user, router]);

  // if (!user || user.role !== 'instructor') {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 