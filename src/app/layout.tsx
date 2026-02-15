// import { Footer, Navigation } from '@/components';
// import { AuthProvider } from '@/context/AuthContext';
// import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
// import { usePathname } from 'next/navigation';
// import './globals.css';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '500', '600', '700'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
//   display: 'swap',
// });

// export const metadata: Metadata = {
//   title: 'Sky Coding - AI Chatbot Platforms & SaaS Development',
//   description:
//     'Build scalable AI-powered platforms and SaaS applications. Specializing in multi-tenant chatbot systems for hotels, clients, and service businesses. Expert in Next.js, React, MongoDB, and AI solutions.',
//   keywords:
//     'AI chatbots, SaaS development, multi-tenant platforms, web development, Next.js, React, MongoDB, AI solutions, hotel chatbots, client automation, software development, Sky Coding',
//   authors: [{ name: 'Sky Coding' }],
//   creator: 'Sky Coding',
//   openGraph: {
//     type: 'website',
//     locale: 'en_US',
//     url: 'https://sky-coding-portfolio-projects-showc.vercel.app',
//     title: 'Sky Coding - AI Chatbot Platforms & SaaS Development',
//     description:
//       'Build scalable AI-powered platforms and SaaS applications. Specializing in multi-tenant chatbot systems for hotels and clients.',
//     siteName: 'Sky Coding',
//     images: [
//       {
//         url: '/og-image.jpg', // You'll need to add this image
//         width: 1200,
//         height: 630,
//         alt: 'Sky Coding - AI Chatbot Platforms',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Sky Coding - AI Chatbot Platforms & SaaS Development',
//     description:
//       'Build scalable AI-powered platforms and SaaS applications. Specializing in multi-tenant chatbot systems.',
//     creator: '@skycodingjr',
//     images: ['/og-image.jpg'],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
//   icons: {
//     icon: '/fav.svg',
//     shortcut: '/fav.svg',
//     apple: '/apple-touch-icon.png',
//   },
//   manifest: '/manifest.json',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang='en' className='scroll-smooth'>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-blue-50 via-white to-indigo-50`}
//       >
//         <AuthProvider>
//           <div className='flex flex-col min-h-screen'>
//             <Navigation />
//             <main>{children}</main>
//             & <Footer />
//           </div>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import ClientProviders from '@/components/ClientProviders';
import LayoutWrapper from '@/components/LayoutWrapper';
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
  title: 'Sky Coding - AI Chatbot Platforms & SaaS Development',
  description:
    'Build scalable AI-powered platforms and SaaS applications. Specializing in multi-tenant chatbot systems for hotels, clients, and service businesses.',
  keywords:
    'AI chatbots, SaaS development, multi-tenant platforms, web development, Next.js, React, MongoDB, AI solutions',
  authors: [{ name: 'Sky Coding' }],
  creator: 'Sky Coding',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sky-coding-portfolio-projects-showc.vercel.app',
    title: 'Sky Coding - AI Chatbot Platforms & SaaS Development',
    description: 'Build scalable AI-powered platforms and SaaS applications.',
    siteName: 'Sky Coding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sky Coding - AI Chatbot Platforms & SaaS Development',
    description: 'Build scalable AI-powered platforms and SaaS applications.',
    creator: '@skycodingjr',
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
        <ClientProviders>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ClientProviders>
      </body>
    </html>
  );
}
