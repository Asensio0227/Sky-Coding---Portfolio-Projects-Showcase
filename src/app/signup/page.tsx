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

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    domain: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          domain: formData.domain,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Signup failed');
        return;
      }

      console.log('Signup successful, redirecting to:', data.data?.redirectUrl);

      await new Promise((resolve) => setTimeout(resolve, 100));

      window.location.href = data.data?.redirectUrl || '/';
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='footer section min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-16'>
      <div>
        <Card className='rounded-3xl shadow-2xl border border-white/20 bg-white/80 backdrop-blur-xl'>
          <CardHeader className='text-center space-y-4 pb-10'>
            <div className='mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg'>
              <img
                src='/fav.svg'
                alt='Sky Coding Logo'
                className='w-12 h-12'
              />{' '}
            </div>

            <CardTitle className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Create Account
            </CardTitle>

            <CardDescription className='text-lg'>
              Start your AI chatbot journey
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
              {/* Business Name */}
              <div className='space-y-3'>
                <Label className='label'>Business Name : </Label>
                <Input
                  type='text'
                  name='businessName'
                  placeholder='Beach Resort & Spa'
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className='input'
                />
              </div>

              {/* Domain */}
              <div className='space-y-3'>
                <Label className='label'>Website Domain : </Label>
                <Input
                  type='text'
                  name='domain'
                  placeholder='beachresort.com'
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  className='input'
                />
                <p className='text-xs text-muted-foreground mt-2'>
                  Example: beachresort.com (no http or www)
                </p>
              </div>

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
                  minLength={6}
                  className='input'
                />
                <p className='text-xs text-muted-foreground mt-2'>
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className='space-y-3'>
                <Label className='label'>Confirm Password : </Label>
                <Input
                  type='password'
                  name='confirmPassword'
                  placeholder='••••••••'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className='input'
                />
              </div>

              {/* Submit */}
              <Button
                type='submit'
                disabled={loading}
                className='submit-btn w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className='flex items-center gap-4'>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
              <span className='text-sm text-gray-500 font-medium'>or</span>
              <div className='flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent' />
            </div>

            {/* Login Link */}
            <p className='text-center text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-blue-600 font-semibold hover:underline'
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
