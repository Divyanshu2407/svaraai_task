'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { token, setToken } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold text-white">
        <Link href="/">SvaraAI Task Manager</Link>
      </div>
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link href="/projects" className="hover:underline">Projects</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="btn text-white bg-white text-blue-600 hover:bg-gray-200 px-4 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn text-white px-4 py-1 rounded hover:bg-blue-500">Login</Link>
        )}
      </div>
    </nav>
  );
}
