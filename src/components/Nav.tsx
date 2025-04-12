'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interface untuk data user
interface UserData {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

const Nav = () => {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPath, setCurrentPath] = useState('/');

  // Pastikan kode hanya dijalankan di client-side
  useEffect(() => {
    setIsClient(true);
    setCurrentPath(window.location.pathname);
    
    // Cek apakah ada data user di localStorage
    const storedUser = localStorage.getItem('mockUser');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('mockUser');
      }
    }
  }, []);

  // Fungsi utilitas untuk simulasi login
  const simulateLogin = (role: string) => {
    const mockUsers = {
      pengguna: {
        userId: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'pengguna'
      },
      admin: {
        userId: 2,
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }
    };

    const selectedUser = role === 'admin' ? mockUsers.admin : mockUsers.pengguna;
    localStorage.setItem('mockUser', JSON.stringify(selectedUser));
    setIsLoggedIn(true);
    setUserData(selectedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('mockUser');
    setIsLoggedIn(false);
    setUserData(null);
    window.location.href = '/';
  };

  // Jangan render apa pun jika masih server-side
  if (!isClient) {
    return null;
  }

  return (
    <nav style={{ backgroundColor: 'var(--primary-color)' }} className="text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Logo/Name */}
        <div className="text-xl font-bold">
          <Link href="/">
            SUARAKAN
          </Link>
        </div>

        {/* Navigation Links - Different based on role */}
        <div className="flex items-center space-x-20">
          {/* Admin Navigation */}
          {isLoggedIn && userData?.role === 'admin' ? (
            <>
              <Link href="/admin/laporan" className="hover:text-gray-300">
                Lihat Laporan
              </Link>
              <Link href="/admin/publikasi" className="hover:text-gray-300">
                Buat Publikasi
              </Link>
            </>
          ) : (
            /* User/Guest Navigation */
            <>
              <Link href="/" className="hover:text-gray-300">
                Beranda
              </Link>
              <Link href="/pelaporan" className="hover:text-gray-300">
                Pelaporan
              </Link>
              <Link href="/pelacakan" className="hover:text-gray-300">
                Pelacakan
              </Link>
              <Link href="/publikasi" className="hover:text-gray-300">
                Publikasi
              </Link>
            </>
          )}
        </div>

        {/* User Info / Login Controls */}
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <span>{userData?.role === 'admin' ? 'Admin' : userData?.fullName}</span>
              <button 
                onClick={handleLogout}
                className="bg-white text-primary hover:bg-gray-300 px-3 py-1 rounded text-sm"
                style={{ color: 'var(--primary-color)' }}
              >
                Logout
              </button>
            </>
          ) : (
            // Development tools untuk mock login
            <div className="flex items-center space-x-2">
              <Link 
                href="/login" 
                className="bg-white hover:bg-gray-300 px-4 py-2 rounded"
                style={{ color: 'var(--primary-color)' }}
              >
                Login
              </Link>
              {/* Dev-only buttons */}
              <div className="ml-4 border-l border-white pl-4 flex space-x-2">
                <button 
                  onClick={() => simulateLogin('pengguna')}
                  className="bg-accent-2 text-white px-2 py-1 rounded text-xs hover:bg-opacity-80"
                  title="Development only: Simulate user login"
                >
                  Dev: Login User
                </button>
                <button 
                  onClick={() => simulateLogin('admin')}
                  className="bg-accent-3 text-white px-2 py-1 rounded text-xs hover:bg-opacity-80"
                  title="Development only: Simulate admin login"
                >
                  Dev: Login Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;