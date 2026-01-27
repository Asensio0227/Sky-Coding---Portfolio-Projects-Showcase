import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function Hero() {
  return (
    <section className='relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-20'>
      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative w-full max-w-5xl mx-auto text-center space-y-12 py-20'>
        {/* Logo */}
        <div className='flex justify-center mb-10 animate-float'>
          <div className='w-32 h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 hover:rotate-6 transition-all duration-500'>
            <img src='/fav.svg' alt='Sky Coding Logo' className='w-12 h-12' />
          </div>
        </div>

        {/* Main heading */}
        <div className='space-y-8 flex flex-col items-center'>
          <Badge
            variant='outline'
            className='px-4 py-2 text-sm font-semibold border-blue-600 text-blue-600'
          >
            <Sparkles className='w-4 h-4 mr-2' />
            Welcome to Sky Coding
          </Badge>

          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight text-center'>
            Transform Your Vision Into
            <span className='block mt-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient'>
              Digital Reality
            </span>
          </h1>

          <p className='text-xl sm:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light px-4 text-center'>
            Expert in building modern web applications, AI-powered chatbots, and
            custom software solutions that transform businesses.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row justify-center items-center gap-6 pt-10'>
          <Button
            asChild
            size='lg'
            className='px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl'
          >
            <Link href='/projects'>
              Explore Projects
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
          <Button
            asChild
            size='lg'
            variant='outline'
            className='btn px-12 py-6 text-lg rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
          >
            <Link href='/contact'>Get in Touch</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-16 px-6'>
          {[
            { number: '15+', label: 'Projects' },
            { number: '100%', label: 'Satisfaction' },
            { number: '5+', label: 'Years' },
          ].map((stat, idx) => (
            <Card
              key={idx}
              className='text-center border-none shadow-lg bg-white/50 backdrop-blur'
            >
              <CardContent className='pt-6'>
                <div className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3'>
                  {stat.number}
                </div>
                <p className='text-muted-foreground text-sm sm:text-base font-medium'>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center pt-2'>
          <div className='w-1 h-2 bg-muted-foreground rounded-full'></div>
        </div>
      </div>
    </section>
  );
}
