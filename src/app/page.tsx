'use client';

import { TechStack } from '@/components';
import Hero from '@/components/Hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Bot, Code2, Smartphone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  media: Media[];
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setFeaturedProjects((data.data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      <Hero />

      <section className='section-center'>
        {/* Featured Projects Section */}
        <section className='py-32'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Section Header */}
            <div className='text-center mb-20 space-y-4 flex flex-col items-center px-4'>
              <Badge variant='secondary' className='mb-2'>
                Portfolio
              </Badge>
              <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground px-6'>
                Featured Projects
              </h2>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-8'>
                Showcasing innovation, creativity, and technical excellence
              </p>
            </div>

            {loading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-6'>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className='overflow-hidden'>
                    <Skeleton className='aspect-video w-full' />
                    <CardHeader>
                      <Skeleton className='h-6 w-3/4' />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className='h-4 w-full mb-2' />
                      <Skeleton className='h-4 w-full mb-2' />
                      <Skeleton className='h-4 w-2/3' />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Projects Grid */}
                <div className='flex justify-center mb-26 px-6 sm:px-8 lg:px-12'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-7xl'>
                    {featuredProjects.map((project) => (
                      <Link key={project._id} href={`/projects/${project._id}`}>
                        <Card className='group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-none'>
                          {/* Media Container */}
                          <div className='aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 m-4 rounded-2xl'>
                            {project.media[0]?.type === 'video' ? (
                              <video
                                src={project.media[0]?.url}
                                className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                                autoPlay
                                loop
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={project.media[0]?.url}
                                alt={project.title}
                                className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700'
                              />
                            )}
                          </div>

                          {/* Content */}
                          <CardHeader>
                            <CardTitle className='text-2xl group-hover:text-blue-600 transition-colors'>
                              {project.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent>
                            <CardDescription className='line-clamp-3 text-base'>
                              {project.description}
                            </CardDescription>
                          </CardContent>

                          <CardFooter className='ml-6 place-items-center align-middle justify-center mb-6'>
                            <Button
                              variant='ghost'
                              className='group-hover:translate-x-2 transition-transform text-blue-600 '
                            >
                              View Project
                              <ArrowRight className='ml-2 h-4 w-4' />
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* View All Button */}
                <div className='flex justify-center px-6 py-12 '>
                  <Button
                    asChild
                    size='lg'
                    className='btn px-14 py-6 text-lg text-stone-50 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl'
                  >
                    <Link href='/projects'>
                      View All Projects
                      <ArrowRight className='ml-3 h-6 w-6' />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Technologies Section */}
        <TechStack />

        {/* Services Section */}
        <section className='footer py-32 bg-gradient-to-br from-gray-50 to-blue-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Section Header */}
            <div className='text-center mb-20 space-y-4 flex flex-col items-center px-4'>
              <Badge
                variant='secondary'
                className='mb-2 bg-purple-100 text-purple-600'
              >
                Services
              </Badge>
              <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground px-6'>
                What We Do Best
              </h2>
              <p className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-8'>
                Comprehensive digital solutions tailored to your needs
              </p>
            </div>

            {/* Services Grid */}
            <div className='flex justify-center px-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl'>
                {[
                  {
                    icon: Code2,
                    title: 'Web Development',
                    description:
                      'Custom websites and web applications built with cutting-edge frameworks like Next.js, React, and TypeScript.',
                  },
                  {
                    icon: Bot,
                    title: 'AI Solutions',
                    description:
                      'Intelligent chatbots and AI-powered tools that automate workflows and enhance customer experiences.',
                  },
                  {
                    icon: Smartphone,
                    title: 'Mobile Apps',
                    description:
                      'Cross-platform mobile applications with seamless performance, beautiful UI, and native-like experiences.',
                  },
                ].map((service, idx) => (
                  <Card
                    key={idx}
                    className='group relative overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-none'
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    <CardHeader className='relative z-10'>
                      <div className='flex justify-center mb-6'>
                        <div className='p-4 rounded-2xl bg-blue-100 group-hover:bg-white/20 transition-colors'>
                          <service.icon className='w-12 h-12 text-blue-600 group-hover:text-white transition-colors' />
                        </div>
                      </div>
                      <CardTitle className='text-2xl text-center group-hover:text-white transition-colors'>
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='relative z-10 text-center'>
                      <p className='text-muted-foreground leading-relaxed group-hover:text-blue-50 transition-colors'>
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='footer py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl mx-4'>
          <div className='max-w-5xl mx-auto px-8 sm:px-12 lg:px-16'>
            <div className='text-center space-y-10 flex flex-col items-center'>
              <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight px-6'>
                Ready to Build Something Amazing?
              </h2>
              <p className='text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-8'>
                Let's collaborate and transform your vision into a powerful
                digital solution that drives results.
              </p>
              <div className='pt-8 flex justify-center px-4'>
                <Button
                  asChild
                  size='lg'
                  variant='secondary'
                  className='btn px-12 py-6 text-lg rounded-2xl shadow-2xl hover:scale-105 transition-all'
                >
                  <Link href='/contact'>Start Your Project Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .section-center {
          display: grid;
          place-items: center;
        }
      `}</style>
    </div>
  );
}
