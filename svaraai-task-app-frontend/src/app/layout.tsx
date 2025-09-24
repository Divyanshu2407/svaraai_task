'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans min-h-screen">
        <AuthProvider>
          {/* Sticky, shadowed navbar */}
          <header className="sticky top-0 z-50 bg-white shadow-sm">
            <Navbar />
          </header>

          {/* Main content area with responsive padding */}
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
