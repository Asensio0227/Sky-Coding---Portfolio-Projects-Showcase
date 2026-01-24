'use client';

/**
 * Skeleton Loaders - Loading placeholders for async content
 */

export function SkeletonCard() {
  return (
    <div className='bg-gray-200 rounded-2xl overflow-hidden animate-pulse'>
      <div className='w-full h-48 bg-gray-300' />
      <div className='p-6 space-y-4'>
        <div className='h-6 bg-gray-300 rounded w-3/4' />
        <div className='h-4 bg-gray-300 rounded' />
        <div className='h-4 bg-gray-300 rounded w-5/6' />
        <div className='h-10 bg-gray-300 rounded mt-6 w-1/3' />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className='animate-pulse'>
      <div className='h-24 w-24 bg-gray-300 rounded-full mx-auto mb-6' />
      <div className='h-10 bg-gray-300 rounded w-2/3 mx-auto mb-4' />
      <div className='h-6 bg-gray-300 rounded w-1/2 mx-auto' />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className='space-y-3 animate-pulse'>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className='h-4 bg-gray-300 rounded w-full' />
      ))}
    </div>
  );
}

export function SkeletonFormInput() {
  return (
    <div className='space-y-2 animate-pulse'>
      <div className='h-4 bg-gray-300 rounded w-1/4' />
      <div className='h-12 bg-gray-300 rounded-xl' />
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className='space-y-6 animate-pulse'>
      <SkeletonFormInput />
      <SkeletonFormInput />
      <SkeletonFormInput />
      <div className='h-12 bg-gray-300 rounded-xl w-full' />
    </div>
  );
}

export function SkeletonProjectDetail() {
  return (
    <div className='animate-pulse space-y-8'>
      <div className='h-96 bg-gray-300 rounded-2xl' />
      <div className='space-y-4'>
        <div className='h-10 bg-gray-300 rounded w-3/4' />
        <div className='h-6 bg-gray-300 rounded w-1/4' />
      </div>
      <div className='space-y-3'>
        <div className='h-4 bg-gray-300 rounded' />
        <div className='h-4 bg-gray-300 rounded' />
        <div className='h-4 bg-gray-300 rounded w-5/6' />
      </div>
    </div>
  );
}
