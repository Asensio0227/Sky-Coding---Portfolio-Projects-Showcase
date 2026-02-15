'use client';

import { ArrowLeft, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50 to-white flex items-center justify-center px-4'>
      <div className='max-w-2xl w-full text-center'>
        {/* 404 Illustration */}
        <div className='mb-8'>
          <h1 className='text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4'>
            404
          </h1>
          <div className='inline-block bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 mb-6'>
            <Search className='w-16 h-16 text-blue-600' />
          </div>
        </div>

        {/* Error Message */}
        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 mb-4'>
          Page Not Found
        </h2>
        <p className='text-lg text-gray-600 mb-12 max-w-md mx-auto leading-relaxed'>
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link
            href='/'
            className='inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105'
          >
            <Home className='w-5 h-5 mr-2' />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center bg-white text-gray-900 font-bold py-4 px-8 rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className='mt-16 pt-16 border-t border-gray-200'>
          <p className='text-sm text-gray-500 mb-6'>
            Maybe you were looking for:
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Link
              href='/projects'
              className='text-blue-600 hover:text-blue-700 font-medium hover:underline'
            >
              Projects
            </Link>
            <span className='text-gray-300'>•</span>
            <Link
              href='/contact'
              className='text-blue-600 hover:text-blue-700 font-medium hover:underline'
            >
              Contact
            </Link>
            <span className='text-gray-300'>•</span>
            <Link
              href='/dashboard'
              className='text-blue-600 hover:text-blue-700 font-medium hover:underline'
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
