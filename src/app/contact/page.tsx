'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@radix-ui/react-label';
import {
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { SocialLinks } from '../../../scripts/seed';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        type: 'success',
        message:
          "Thank you for your message! We'll get back to you as soon as possible.",
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: (
        <svg
          className='w-8 h-8'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
          />
        </svg>
      ),
      title: 'Email',
      description: 'skycodingjr@gmail.com',
      href: 'mailto:skycodingjr@gmail.com',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: (
        <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.65 1.438 5.166L2 22l4.964-1.303A9.94 9.94 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm5.406 14.438c-.227.637-1.334 1.235-1.875 1.312-.517.075-1.187.107-1.914-.121-.442-.141-1.01-.328-1.74-.646-3.06-1.32-5.062-4.542-5.219-4.752-.156-.21-1.25-1.668-1.25-3.182 0-1.515.797-2.257 1.079-2.569.281-.313.625-.391.833-.391.208 0 .417.002.599.01.192.009.451-.073.703.536.252.607.857 2.096.933 2.246.076.15.126.329.026.53-.1.202-.15.329-.299.505-.15.176-.315.392-.45.526-.149.147-.305.307-.131.602.174.295.775 1.279 1.665 2.073 1.145 1.022 2.11 1.337 2.407 1.486.299.148.472.125.649-.075.176-.201.748-.872.949-1.172.2-.299.4-.25.676-.149.277.1 1.755.826 2.057.977.303.149.504.223.579.347.075.125.075.72-.151 1.357z' />
        </svg>
      ),
      title: 'WhatsApp',
      description: 'Chat with us directly',
      href: 'https://wa.me/263786974895',
      color: 'from-green-500 to-green-600',
    },
  ];

  const socialLink = [
    {
      name: 'WhatsApp',
      href: 'https://wa.me/263786974895',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61584322210511',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/skycodingjr/',
      icon: Instagram,
      color: 'from-pink-500 via-rose-500 to-orange-500',
    },
    {
      name: 'Twitter/X',
      href: 'https://x.com/skycodingjr',
      icon: Twitter,
      color: 'from-sky-400 to-blue-500',
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@SkyCoding-q5h',
      icon: Youtube,
      color: 'from-red-500 to-red-700',
    },
  ];

  return (
    <div className='section footer bg-gradient-to-b from-white via-gray-50 to-white min-h-screen'>
      {/* Page Header */}
      <section className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40'>
        <div className='text-center'>
          <span className='text-blue-600 font-semibold text-sm uppercase tracking-wider px-6 py-3 bg-blue-50 rounded-full inline-block mb-8'>
            Get In Touch
          </span>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 mb-6 px-4'>
            Let's Build Something Great Together
          </h1>
          <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4'>
            Have a project in mind? We'd love to hear from you. Let's discuss
            how we can help bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className='footer max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={
                method.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              }
              className='spacing group bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-gray-100 p-10 sm:p-12 hover:border-blue-300 transition-all duration-300 flex items-start gap-6'
            >
              <div
                className={`text-white bg-gradient-to-br ${method.color} p-5 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}
              >
                {method.icon}
              </div>
              <div className='flex-1'>
                <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
                  {method.title}
                </h3>
                <p className='text-gray-600 group-hover:text-blue-600 transition-colors duration-300 text-lg'>
                  {method.description}
                </p>
              </div>
              <svg
                className='w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className='form max-w-4xl mx-auto px-6 sm:px-10 pb-32'>
        <Card className='rounded-3xl shadow-2xl border border-gray-200'>
          <CardHeader className='text-center space-y-3 pb-10'>
            <CardTitle className='text-4xl font-bold'>Send a Message</CardTitle>
            <CardDescription className='text-lg'>
              We usually respond within 24 hours
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-10'>
            {submitStatus && (
              <Alert
                className={`${
                  submitStatus.type === 'success'
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <AlertDescription className='font-medium'>
                  {submitStatus.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className='spacing space-y-40'>
              <div className='spacing grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-3'>
                  <Label>Your Name</Label>
                  <Input
                    name='name'
                    placeholder='John Doe'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='spacing'
                  />
                </div>

                <div className='space-y-3'>
                  <Label>Email Address</Label>
                  <Input
                    type='email'
                    name='email'
                    placeholder='john@example.com'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='spacing'
                  />
                </div>
              </div>

              <div className='space-y-3'>
                <Label>Subject</Label>
                <Input
                  name='subject'
                  placeholder='Project Inquiry'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='spacing'
                />
              </div>

              <div className='space-y-3'>
                <Label>Message</Label>
                <Textarea
                  rows={6}
                  name='message'
                  placeholder='Tell us about your project...'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className='spacing'
                />
              </div>

              <Button
                type='submit'
                disabled={submitting}
                className='w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:opacity-90'
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Social Links Section */}
      <section className='form footer max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-32'>
        <div className='bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-3xl border border-gray-200 p-12 sm:p-16 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 mb-6'>
            Connect With Us on Social Media
          </h2>
          <p className='spacing text-gray-700 text-lg mb-12 max-w-2xl mx-auto leading-relaxed'>
            Follow us for the latest updates, project showcases, and tech
            insights
          </p>

          <div className='flex flex-wrap justify-center gap-6 mb-8'>
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                className='spacing group flex flex-col items-center gap-3 px-8 py-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 min-w-[140px]'
                title={social.name}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <social.icon className='w-8 h-8 text-white' />
                </div>
                <span className='font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
