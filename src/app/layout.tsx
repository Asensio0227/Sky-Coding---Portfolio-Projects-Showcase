import { Footer, Navigation } from '@/components';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sky Coding - Portfolio & Projects Showcase',
  description:
    'Expert in building modern web applications, AI-powered chatbots, and custom software solutions. Transforming businesses through innovative technology.',
  keywords:
    'software development, web development, portfolio, projects, AI chatbots, mobile apps, Next.js, React, Sky Coding',
  authors: [{ name: 'Sky Coding' }],
  creator: 'Sky Coding',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skycoding.dev',
    title: 'Sky Coding - Portfolio & Projects Showcase',
    description:
      'Expert in building modern web applications, AI-powered chatbots, and custom software solutions.',
    siteName: 'Sky Coding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sky Coding - Portfolio & Projects Showcase',
    description:
      'Expert in building modern web applications, AI-powered chatbots, and custom software solutions.',
    creator: '@skycoding',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/fav.svg',
    shortcut: '/fav.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-50 via-white to-indigo-50`}
      >
        <AuthProvider>
          <div className='flex flex-col min-h-screen'>
            <Navigation />
            <main className='main'>{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
