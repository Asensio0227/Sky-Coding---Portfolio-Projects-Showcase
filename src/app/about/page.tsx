// src/app/about/page.tsx
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
  Award,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { icon: CheckCircle2, value: '50+', label: 'Projects Completed' },
    { icon: Users, value: '30+', label: 'Happy Clients' },
    { icon: Award, value: '5+', label: 'Years Experience' },
    { icon: Zap, value: '20+', label: 'Technologies' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        'Leveraging cutting-edge technologies to deliver solutions that give businesses a competitive edge in the digital landscape.',
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Target,
      title: 'Quality',
      description:
        'Every line of code is crafted with precision. Clean, maintainable, and well-documented code that stands the test of time.',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Heart,
      title: 'Client Success',
      description:
        'Your success is my success. Committed to understanding your goals and delivering solutions that exceed expectations.',
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
  ];

  const services = [
    {
      icon: Bot,
      title: 'AI Chatbot Development',
      description:
        'Custom AI-powered chatbots for customer service, lead generation, and business automation.',
      features: [
        '24/7 automated support',
        'Natural language processing',
        'Multi-platform integration',
        'Analytics dashboard',
      ],
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Code2,
      title: 'Web Development',
      description:
        'Modern, responsive websites and web applications built with Next.js, React, and TypeScript.',
      features: [
        'Responsive design',
        'SEO optimized',
        'Fast performance',
        'Secure & scalable',
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Rocket,
      title: 'SaaS Platform Development',
      description:
        'Full-stack SaaS applications with authentication, payments, and comprehensive analytics.',
      features: [
        'User management',
        'Payment integration',
        'Admin dashboards',
        'API development',
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description:
        'Cross-platform mobile applications for iOS and Android with native-like performance.',
      features: [
        'React Native',
        'Cross-platform',
        'Native features',
        'Push notifications',
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const techCategories = [
    {
      category: 'Frontend',
      icon: Code2,
      color: 'text-blue-600',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'],
    },
    {
      category: 'Backend',
      icon: Database,
      color: 'text-green-600',
      skills: ['Node.js', 'Express', 'REST APIs', 'GraphQL', 'WebSockets'],
    },
    {
      category: 'Database',
      icon: Shield,
      color: 'text-purple-600',
      skills: ['MongoDB', 'Mongoose', 'PostgreSQL', 'Redis', 'Firebase'],
    },
    {
      category: 'AI & Tools',
      icon: Sparkles,
      color: 'text-orange-600',
      skills: ['OpenAI', 'Claude AI', 'LangChain', 'Cloudinary', 'Vercel'],
    },
  ];

  return (
    <div className='footer min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'>
      {/* Hero Section */}
      <section className='spacing relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 pt-32 pb-20 text-white'>
        <div className='absolute inset-0 bg-black/10'></div>

        <div className='container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            {/* Left: Text Content */}
            <div className='space-y-6'>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30'
              >
                <Globe className='w-4 h-4 mr-2' />
                Bulawayo, Zimbabwe
              </Badge>

              <h1 className='text-4xl font-bold md:text-5xl lg:text-6xl leading-tight'>
                About Sky Coding
              </h1>

              <p className='text-lg md:text-xl text-blue-100 leading-relaxed'>
                Transforming businesses through intelligent software solutions
                and cutting-edge AI technology. Building the future, one line of
                code at a time.
              </p>

              <div className='flex flex-wrap gap-4 pt-4'>
                <Button
                  asChild
                  size='lg'
                  variant='secondary'
                  className='spacing btn rounded-xl shadow-xl hover:scale-105 transition-all'
                >
                  <Link href='/projects'>View Projects</Link>
                </Button>
                <Button
                  asChild
                  size='lg'
                  variant='outline'
                  className='spacing btn rounded-xl border-2 border-white  text-white hover:bg-white/10'
                >
                  <Link href='/contact' className='text-white'>
                    Get in Touch
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Profile Image */}
            <div className='flex justify-center lg:justify-end'>
              <div className='relative h-80 w-80 overflow-hidden rounded-full border-8 border-white/20 shadow-2xl'>
                <Image
                  src='/fav.svg'
                  alt='Sky Coding Developer'
                  fill
                  className='object-cover'
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='centre footer spacing border-b border-gray-200  py-12'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  className=' spacing border-none shadow-sm hover:shadow-lg transition-all'
                >
                  <CardContent className='pt-6 text-center'>
                    <IconComponent className='w-10 h-10 mx-auto mb-3 text-blue-600' />
                    <div className='text-3xl md:text-4xl font-bold text-blue-600 mb-1'>
                      {stat.value}
                    </div>
                    <div className='text-sm text-gray-600'>{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className='section-center spacing py-16 md:py-20'>
        <div className='container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <Card className='spacing border-none shadow-xl'>
            <CardHeader className='space-y-4'>
              <Badge variant='secondary' className='w-fit'>
                <Sparkles className='w-4 h-4 mr-2' />
                My Story
              </Badge>
              <CardTitle className='text-3xl md:text-4xl'>
                Passionate About Building Digital Solutions
              </CardTitle>
            </CardHeader>

            <CardContent className='space-y-4 text-gray-700 leading-relaxed'>
              <p className='text-lg'>
                Hello! I'm the founder of{' '}
                <strong className='text-blue-600'>Sky Coding</strong>, a
                passionate software developers. With over 5 years of experience
                in web development and AI integration, I specialize in creating
                innovative solutions that help businesses thrive in the digital
                age.
              </p>

              <p>
                My journey into software development started with a simple
                curiosity about how websites work. That curiosity evolved into a
                deep passion for building elegant, efficient, and user-friendly
                applications. Today, I focus on developing AI-powered chatbots
                and modern web applications using cutting-edge technologies like
                Next.js, React, and TypeScript.
              </p>

              <p>
                What sets me apart is my commitment to understanding each
                client's unique needs. I don't just write code—I create
                solutions that solve real business problems. Whether it's
                automating customer service with AI chatbots, building a
                full-stack SaaS platform, or developing a stunning portfolio
                website, I approach every project with dedication and attention
                to detail.
              </p>

              <p>
                I believe in the power of technology to transform businesses,
                especially for small and medium-sized enterprises that may not
                have access to large development teams. My mission is to make
                advanced technology accessible and affordable, helping
                businesses compete in an increasingly digital world.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission & Values */}
      <section className='section-center spacing py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12 space-y-4'>
            <Badge
              variant='secondary'
              className='bg-purple-100 text-purple-600'
            >
              <Heart className='w-4 h-4 mr-2' />
              Core Values
            </Badge>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
              Mission & Values
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Guided by principles that drive excellence in every project
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-3'>
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card
                  key={index}
                  className='spacing group border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'
                >
                  <CardHeader>
                    <div
                      className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className={`w-8 h-8 text-gray-700`} />
                    </div>
                    <CardTitle className='text-2xl'>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-600 leading-relaxed'>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className='section-center spacing py-16 md:py-20'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12 space-y-4'>
            <Badge variant='secondary' className='bg-blue-100 text-blue-600'>
              <Rocket className='w-4 h-4 mr-2' />
              Services
            </Badge>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
              Areas of Expertise
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Comprehensive solutions tailored to your business needs
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card
                  key={index}
                  className='spacing border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'
                >
                  <CardHeader>
                    <div
                      className={`w-14 h-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <IconComponent className={`w-7 h-7 ${service.color}`} />
                    </div>
                    <CardTitle className='text-2xl'>{service.title}</CardTitle>
                    <CardDescription className='text-base'>
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className='space-y-2'>
                      {service.features.map((feature, i) => (
                        <li key={i} className='flex items-start gap-2'>
                          <CheckCircle2 className='w-5 h-5 text-green-600 flex-shrink-0 mt-0.5' />
                          <span className='text-gray-700'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className='section-center spacing py-16 md:py-20 bg-gray-50'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12 space-y-4'>
            <Badge
              variant='secondary'
              className='bg-indigo-100 text-indigo-600'
            >
              <Code2 className='w-4 h-4 mr-2' />
              Technology Stack
            </Badge>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold'>
              Technologies I Use
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Modern tools and frameworks for exceptional results
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {techCategories.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Card
                  key={index}
                  className='spacing border-none shadow-md hover:shadow-xl transition-all'
                >
                  <CardHeader>
                    <div className='flex items-center gap-3 mb-3'>
                      <IconComponent className={`w-6 h-6 ${tech.color}`} />
                      <CardTitle className='text-xl'>{tech.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {tech.skills.map((skill, i) => (
                        <Badge key={i} variant='secondary' className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-center spacing footer py-20 md:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 mx-4 rounded-3xl'>
        <div className='container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-8'>
            <Badge
              variant='secondary'
              className='bg-white/20 text-white border-white/30'
            >
              <Zap className='w-4 h-4 mr-2' />
              Let's Work Together
            </Badge>

            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'>
              Ready to Build Something Amazing?
            </h2>

            <p className='text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed'>
              Let's collaborate and transform your vision into a powerful
              digital solution that drives results and grows your business.
            </p>

            <div className='flex flex-wrap gap-4 justify-center pt-4'>
              <Button
                asChild
                size='lg'
                variant='secondary'
                className='btn spacing rounded-xl shadow-2xl hover:scale-105 transition-all'
              >
                <Link href='/contact'>Start Your Project</Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='btn spacing rounded-xl shadow-2xl hover:scale-105 transition-all'
              >
                <Link href='/projects'>View Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
