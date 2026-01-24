'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // Important: include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      console.log('Login successful, redirecting to:', data.data?.redirectUrl);

      // Small delay to ensure cookie is set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use window.location for hard navigation (ensures middleware runs)
      window.location.href = data.data?.redirectUrl || '/';
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-16'>
      <div className='section-center main w-full max-w-md'>
        <Card className='rounded-3xl shadow-2xl border border-white/20 bg-white/80 backdrop-blur-xl'>
          <CardHeader className='text-center space-y-4 pb-10'>
            <div className='mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg'>
              <span className='text-white font-bold text-2xl'>SC</span>
            </div>

            <CardTitle className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Welcome Back
            </CardTitle>

            <CardDescription className='text-lg'>
              Sign in to your Sky Coding account
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-8'>
            {error && (
              <Alert className='border-red-200 bg-red-50'>
                <AlertDescription className='text-red-700 font-medium'>
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className='form py-20 align-middle my-30 space-y-8'
            >
              {/* Email */}
              <div className='space-y-3'>
                <Label className='label'>Email Address : </Label>
                <Input
                  type='email'
                  name='email'
                  placeholder='you@example.com'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='input'
                />
              </div>

              {/* Password */}
              <div className='space-y-3'>
                <Label className='label'>Password : </Label>
                <Input
                  type='password'
                  name='password'
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className='input'
                />
              </div>

              {/* Submit */}
              <Button
                type='submit'
                disabled={loading}
                className='submit-btn w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className='flex items-center gap-4'>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
              <span className='text-sm text-gray-500 font-medium'>or</span>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
            </div>

            {/* Signup */}
            <p className='text-center text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link
                href='/signup'
                className='text-blue-600 font-semibold hover:underline'
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
