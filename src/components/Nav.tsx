'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserData {
  id: number;
  full_name: string;
  email: string;
  user_type: string;
  is_email_verified: boolean;
}

const Nav = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/user-profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUserData(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('is_logged_in');
    setIsLoggedIn(false);
    setUserData(null);
    router.push('/');
  };

  if (loading) {
    return null;
  }

  return (
    <nav style={{ backgroundColor: 'var(--primary-color)' }} className="text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link href="/">SUARAKAN</Link>
        </div>

        <div className="flex items-center space-x-20">
          {isLoggedIn && userData?.user_type === 'ADMIN' ? (
            <>
              <Link href="/admin/report" className="hover:text-gray-300">Lihat Laporan</Link>
              <Link href="/admin/publication" className="hover:text-gray-300">Buat Publikasi</Link>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-gray-300">Beranda</Link>
              <Link href="/report" className="hover:text-gray-300">Pelaporan</Link>
              <Link href="/progress" className="hover:text-gray-300">Pelacakan</Link>
              <Link href="/publication" className="hover:text-gray-300">Publikasi</Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <span>{localStorage.getItem("user_role") === 'ADMIN' ? 'Admin' : userData?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-primary hover:bg-gray-300 px-3 py-1 rounded text-sm"
                style={{ color: 'var(--primary-color)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-white hover:bg-gray-300 px-4 py-2 rounded"
              style={{ color: 'var(--primary-color)' }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;