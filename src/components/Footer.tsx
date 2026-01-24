'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/263786974895',
      icon: (
        <svg
          className='w-5 h-5'
          viewBox='0 0 24 24'
          fill='currentColor'
          aria-hidden='true'
        >
          <path d='M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.65 1.438 5.166L2 22l4.964-1.303A9.94 9.94 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm5.406 14.438c-.227.637-1.334 1.235-1.875 1.312-.517.075-1.187.107-1.914-.121-.442-.141-1.01-.328-1.74-.646-3.06-1.32-5.062-4.542-5.219-4.752-.156-.21-1.25-1.668-1.25-3.182 0-1.515.797-2.257 1.079-2.569.281-.313.625-.391.833-.391.208 0 .417.002.599.01.192.009.451-.073.703.536.252.607.857 2.096.933 2.246.076.15.126.329.026.53-.1.202-.15.329-.299.505-.15.176-.315.392-.45.526-.149.147-.305.307-.131.602.174.295.775 1.279 1.665 2.073 1.145 1.022 2.11 1.337 2.407 1.486.299.148.472.125.649-.075.176-.201.748-.872.949-1.172.2-.299.4-.25.676-.149.277.1 1.755.826 2.057.977.303.149.504.223.579.347.075.125.075.72-.151 1.357z' />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61584322210511',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/skycodingjr/',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      href: 'https://x.com/skycodingjr',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@SkyCoding-q5h',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
        </svg>
      ),
    },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className='spacing bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white mt-16 md:mt-24'>
      <div className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16'>
          {/* Company Info */}
          <div className='space-y-6'>
            <div className='flex items-center gap-3'>
              <Card className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg border-none'>
                <img
                  src='/fav.svg'
                  alt='Sky Coding Logo'
                  className='w-12 h-12'
                />
              </Card>
              <span className='text-xl font-bold'>Sky Coding</span>
            </div>
            <p className='text-gray-300 leading-relaxed text-sm md:text-base'>
              Building innovative digital solutions that transform businesses
              and empower growth.
            </p>
            <div className='space-y-3'>
              <a
                href='mailto:skycodingjr@gmail.com'
                className='flex items-center gap-3 text-gray-300 hover:text-white transition-colors group'
              >
                <Mail className='w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors' />
                <span className='text-sm text-blue-400'>
                  skycodingjr@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-6'>
            <h3 className='text-lg font-bold'>Quick Links</h3>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-gray-300 hover:text-white transition-all hover:translate-x-1 inline-block text-sm md:text-base'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div className='space-y-6'>
            <h3 className='text-lg font-bold'>Connect With Us</h3>
            <div className='flex flex-wrap gap-3'>
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  asChild
                  variant='ghost'
                  size='icon'
                  className='w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all transform hover:scale-110 hover:shadow-lg'
                >
                  <a
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    title={social.name}
                  >
                    <span className='text-white hover:text-blue-300 transition-colors'>
                      {social.icon}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <Separator className='bg-white/10 mb-8' />
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 pt-4'>
          <p className='text-gray-400 text-xs md:text-sm text-center md:text-left'>
            © {currentYear} Sky Coding. All rights reserved.
          </p>
          <p className='text-gray-400 text-xs md:text-sm flex items-center gap-2'>
            Built with <Heart className='w-4 h-4 text-red-500 fill-current' />{' '}
            using Next.js & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
