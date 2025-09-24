'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      setToken(res.data.token);
      router.push('/projects');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-md p-8">
        {/* Heading */}
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-6">
          Welcome Back
        </h1>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Login button */}
          <Button
            onClick={handleLogin}
            className="btn w-full mt-2 text-lg"
          >
            Login
          </Button>
        </div>

        {/* Sub-text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Enter your credentials to access the dashboard
        </p>

        {/* Signup link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-3">New here?</p>
          <Button
            onClick={() => router.push('/signup')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold 
                       rounded-lg px-4 py-2 transition"
          >
            Create an Account
          </Button>
        </div>
      </div>
    </div>
  );
}
