'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bot,
  Cloud,
  Code2,
  Database,
  Layers,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function TechnologiesSection() {
  const technologies = [
    {
      category: 'Frontend',
      icon: Code2,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      skills: [
        'React',
        'Next.js',
        'TypeScript',
        'Tailwind CSS',
        'React Native',
      ],
    },
    {
      category: 'Backend',
      icon: Settings,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      skills: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'WebSockets'],
    },
    {
      category: 'Database',
      icon: Database,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'Redis', 'Firebase'],
    },
    {
      category: 'AI & ML',
      icon: Bot,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      skills: ['AI Chatbots', 'NLP', 'Machine Learning', 'OpenAI', 'LangChain'],
    },
    {
      category: 'Cloud & Tools',
      icon: Cloud,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      skills: ['Cloudinary', 'AWS', 'Vercel', 'Git', 'Docker'],
    },
    {
      category: 'Mobile',
      icon: Smartphone,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      skills: ['React Native', 'iOS', 'Android', 'Expo', 'Cross-platform'],
    },
  ];

  const techIcons = [
    {
      name: 'React',
      icon: Code2,
      desc: 'Modern UI Library',
      color: 'text-blue-600',
    },
    {
      name: 'Next.js',
      icon: Layers,
      desc: 'Full-stack Framework',
      color: 'text-slate-900',
    },
    {
      name: 'TypeScript',
      icon: Sparkles,
      desc: 'Type Safety',
      color: 'text-blue-500',
    },
    {
      name: 'MongoDB',
      icon: Database,
      desc: 'NoSQL Database',
      color: 'text-green-600',
    },
    {
      name: 'Cloudinary',
      icon: Cloud,
      desc: 'Media Management',
      color: 'text-indigo-600',
    },
    {
      name: 'AI',
      icon: Bot,
      desc: 'Smart Solutions',
      color: 'text-orange-600',
    },
    {
      name: 'Mobile',
      icon: Smartphone,
      desc: 'Cross-platform',
      color: 'text-pink-600',
    },
    {
      name: 'Security',
      icon: Shield,
      desc: 'JWT Auth',
      color: 'text-purple-600',
    },
  ];

  return (
    <section className='footer py-20 md:py-32 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header with spacing */}
        <div className='text-center mb-16 md:mb-24 space-y-4'>
          <Badge
            variant='secondary'
            className='mb-4  text-indigo-600 px-5 py-2.5'
          >
            <Zap className='w-4 h-4 mr-2' />
            Technology Stack
          </Badge>
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight'>
            Built With Modern Technologies
          </h2>
          <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6'>
            Leveraging cutting-edge tools and frameworks to deliver exceptional
            digital experiences
          </p>
        </div>

        {/* Technology Categories with proper spacing */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24'>
          {technologies.map((tech, idx) => {
            const IconComponent = tech.icon;
            return (
              <Card
                key={idx}
                className='spacing group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-none'
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                <CardHeader className='relative z-10 p-6 md:p-8 space-y-4'>
                  {/* Icon with margin */}
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 ${tech.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-md`}
                  >
                    <IconComponent
                      className={`w-7 h-7 md:w-8 md:h-8 ${tech.textColor}`}
                    />
                  </div>

                  {/* Category with spacing */}
                  <CardTitle className='text-xl md:text-2xl mt-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300'>
                    {tech.category}
                  </CardTitle>
                </CardHeader>

                <CardContent className='relative z-10 px-6 md:px-8 pb-6 md:pb-8'>
                  {/* Skills with proper gap */}
                  <div className='flex flex-wrap gap-2 md:gap-3'>
                    {tech.skills.map((skill, i) => (
                      <Badge
                        key={i}
                        variant='secondary'
                        className='px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-all duration-300'
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tech Icons Grid with spacing */}
        <Card className='footer section shadow-xl border-none mb-16 md:mb-24'>
          <CardHeader className='pt-8 md:pt-12 pb-6 md:pb-8'>
            <CardTitle className='text-2xl md:text-3xl text-center'>
              Core Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className='px-4 md:px-8 pb-8 md:pb-12'>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8'>
              {techIcons.map((tech, idx) => {
                const IconComponent = tech.icon;
                return (
                  <div
                    key={idx}
                    className='spacing group text-center p-4 md:p-6 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 cursor-pointer'
                  >
                    <div className='flex justify-center mb-3 md:mb-4'>
                      <IconComponent
                        className={`w-10 h-10 md:w-12 md:h-12 ${tech.color} transform group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                    <h4 className='font-bold text-foreground mb-2 text-base md:text-lg'>
                      {tech.name}
                    </h4>
                    <p className='text-xs md:text-sm text-muted-foreground leading-relaxed'>
                      {tech.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* CTA with proper spacing */}
        <div className='mt-12 md:mt-16 text-center space-y-6 md:space-y-8'>
          <p className='text-lg md:text-xl text-foreground leading-relaxed max-w-3xl mx-auto px-4'>
            Ready to bring your project to life with these technologies?
          </p>
          <Button
            asChild
            size='lg'
            className='px-8 py-6 text-base md:text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300'
          >
            <Link href='/contact'>Start Your Project</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
