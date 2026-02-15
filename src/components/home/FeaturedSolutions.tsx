'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bot, Cloud, Code2 } from 'lucide-react';

export default function FeaturedSolutions() {
  const solutions = [
    {
      icon: Bot,
      title: 'AI Chatbot Platforms',
      description:
        'Multi-tenant SaaS platforms with intelligent chatbots that handle customer inquiries 24/7. Perfect for hotels and clients.',
      features: [
        'Self-service client onboarding',
        'Real-time conversation analytics',
        'Custom AI training on business data',
        'Secure multi-client architecture',
      ],
      techStack: 'Next.js, MongoDB, OpenAI, LangChain',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Cloud,
      title: 'SaaS Platforms',
      description:
        'Build scalable software-as-a-service platforms with automated user provisioning, authentication, and billing.',
      features: [
        'Multi-tenant architecture',
        'User authentication (JWT)',
        'Admin dashboards',
        'API integrations',
      ],
      techStack: 'Next.js, MongoDB, Stripe, AWS',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Code2,
      title: 'Custom Web Applications',
      description:
        'Tailor-made web applications built with modern frameworks, optimized for performance and user experience.',
      features: [
        'Responsive design',
        'RESTful APIs',
        'Database design',
        'Cloud deployment',
      ],
      techStack: 'React, Node.js, TypeScript, Tailwind',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <section className='section-center py-20 md:py-32 bg-gradient-to-br from-white via-gray-50 to-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16 space-y-4'>
          <Badge variant='secondary' className='mb-2'>
            Solutions
          </Badge>
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground'>
            Solutions That Drive Results
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Specialized in building intelligent platforms that automate
            workflows and transform how businesses operate
          </p>
        </div>

        {/* Solutions Grid */}
        <div className=' grid grid-cols-1 md:grid-cols-3 gap-8'>
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <Card
                key={index}
                className='spacing group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-none'
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <CardHeader className='relative z-10'>
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${solution.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors shadow-md`}
                  >
                    <IconComponent
                      className={`w-8 h-8 text-${solution.color}-600 group-hover:text-white transition-colors`}
                    />
                  </div>

                  <CardTitle className='text-2xl mb-3 group-hover:text-white transition-colors'>
                    {solution.title}
                  </CardTitle>
                  <CardDescription className='text-base leading-relaxed group-hover:text-blue-50 transition-colors'>
                    {solution.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className='relative z-10'>
                  {/* Features */}
                  <ul className='space-y-2 mb-6'>
                    {solution.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className='flex items-start text-sm group-hover:text-white transition-colors'
                      >
                        <svg
                          className='w-5 h-5 text-green-500 group-hover:text-green-300 mr-2 flex-shrink-0 mt-0.5'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack */}
                  <div className='pt-4 border-t border-gray-200 group-hover:border-white/20'>
                    <p className='text-sm font-semibold text-gray-500 group-hover:text-white/80 mb-1'>
                      Tech Stack:
                    </p>
                    <p
                      className={`text-sm font-semibold text-${solution.color}-600 group-hover:text-white`}
                    >
                      {solution.techStack}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
