/**
 * Application Constants
 * Centralized configuration and constants
 */

// ==================== APP INFO ====================

export const APP_NAME = 'Sky Coding';
export const APP_TAGLINE = 'Building Intelligent Solutions with AI';
export const APP_DESCRIPTION =
  'Professional web development and AI chatbot solutions for businesses. Specializing in Next.js, React, and custom AI integrations.';

export const OWNER_INFO = {
  name: 'Sky Coding',
  email: 'skycodingjr@gmail.com',
  phone: '+263786974895',
  location: 'Harare, Zimbabwe',
  website: 'https://sky-coding-portfolio-projects-showc.vercel.app',
};

// ==================== SOCIAL LINKS ====================

export const SOCIAL_LINKS = {
  whatsapp: 'https://wa.me/263786974895',
  facebook: 'https://www.facebook.com/profile.php?id=61584322210511',
  instagram: 'https://www.instagram.com/skycodingjr/',
  twitter: 'https://x.com/skycodingjr',
  linkedin: '', // Add when available
  github: 'http://github.com/Asensio0227',
};

// ==================== PROJECT CATEGORIES ====================

export const PROJECT_CATEGORIES = [
  'AI Solutions',
  'SaaS Platform',
  'E-Commerce',
  'Real Estate',
  'Healthcare',
  'Client & Hospitality',
  'Education',
  'Finance',
  'Social Media',
  'Business Tools',
  'Web App',
  'Mobile App',
  'Other',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

// ==================== BUSINESS TYPES ====================

export const BUSINESS_TYPES = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'client', label: 'Client' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'resort', label: 'Resort' },
  { value: 'other', label: 'Other' },
] as const;

// ==================== TECH STACK ====================

export const TECH_STACK = {
  frontend: [
    { name: 'Next.js', icon: '/logos/nextjs.svg' },
    { name: 'React', icon: '/logos/react.svg' },
    { name: 'TypeScript', icon: '/logos/typescript.svg' },
    { name: 'Tailwind CSS', icon: '/logos/tailwind.svg' },
    { name: 'Framer Motion', icon: '/logos/framer.svg' },
  ],
  backend: [
    { name: 'Node.js', icon: '/logos/nodejs.svg' },
    { name: 'Express', icon: '/logos/express.svg' },
    { name: 'Next.js API', icon: '/logos/nextjs.svg' },
  ],
  database: [
    { name: 'MongoDB', icon: '/logos/mongodb.svg' },
    { name: 'Mongoose', icon: '/logos/mongoose.svg' },
    { name: 'PostgreSQL', icon: '/logos/postgresql.svg' },
  ],
  ai: [
    { name: 'OpenAI GPT', icon: '/logos/openai.svg' },
    { name: 'Anthropic Claude', icon: '/logos/anthropic.svg' },
    { name: 'LangChain', icon: '/logos/langchain.svg' },
  ],
  auth: [
    { name: 'JWT', icon: '/logos/jwt.svg' },
    { name: 'bcrypt', icon: '/logos/bcrypt.svg' },
    { name: 'NextAuth', icon: '/logos/nextauth.svg' },
  ],
  deployment: [
    { name: 'Vercel', icon: '/logos/vercel.svg' },
    { name: 'AWS', icon: '/logos/aws.svg' },
    { name: 'Cloudinary', icon: '/logos/cloudinary.svg' },
  ],
  mobile: [
    { name: 'React Native', icon: '/logos/react.svg' },
    { name: 'Expo', icon: '/logos/expo.svg' },
  ],
  tools: [
    { name: 'Git', icon: '/logos/git.svg' },
    { name: 'VS Code', icon: '/logos/vscode.svg' },
    { name: 'Figma', icon: '/logos/figma.svg' },
  ],
};

// ==================== SERVICES ====================

export const SERVICES = [
  {
    id: 'ai-chatbots',
    title: 'AI Chatbot Development',
    description:
      'Custom AI-powered chatbots for customer service, lead generation, and automation.',
    icon: '🤖',
    features: [
      '24/7 automated customer support',
      'Natural language processing',
      'Multi-platform integration',
      'Analytics dashboard',
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description:
      'Modern, responsive websites and web applications built with cutting-edge technologies.',
    icon: '💻',
    features: [
      'Responsive design',
      'SEO optimized',
      'Fast performance',
      'Secure & scalable',
    ],
  },
  {
    id: 'saas-platforms',
    title: 'SaaS Platform Development',
    description:
      'Full-stack SaaS applications with authentication, payments, and analytics.',
    icon: '🚀',
    features: [
      'User management',
      'Payment integration',
      'Admin dashboards',
      'API development',
    ],
  },
  {
    id: 'mobile-apps',
    title: 'Mobile App Development',
    description: 'Cross-platform mobile applications for iOS and Android.',
    icon: '📱',
    features: [
      'React Native',
      'Cross-platform',
      'Native performance',
      'Push notifications',
    ],
  },
];

// ==================== FEATURED SOLUTIONS ====================

export const FEATURED_SOLUTIONS = [
  {
    id: 'ai-chatbot-platform',
    title: 'AI Chatbot Platform',
    tagline: 'Intelligent customer service automation',
    description:
      'A complete SaaS platform for businesses to deploy AI chatbots on their websites.',
    icon: '🤖',
    features: [
      'No-code setup in under 5 minutes',
      'Multi-language support',
      'Custom training on your data',
      'Real-time analytics',
    ],
    metrics: {
      setupTime: '< 5 min',
      responseTime: '< 1 sec',
      accuracy: '95%+',
      availability: '24/7',
    },
  },
  {
    id: 'business-automation',
    title: 'Business Process Automation',
    tagline: 'Streamline your operations with AI',
    description:
      'Automate repetitive tasks and improve efficiency with custom AI solutions.',
    icon: '⚡',
    features: [
      'Workflow automation',
      'Document processing',
      'Email automation',
      'Data analysis',
    ],
    metrics: {
      timeSaved: '40%+',
      errorReduction: '90%+',
      roi: '300%+',
      integration: 'Seamless',
    },
  },
];

// ==================== STATS ====================

export const STATS = [
  { label: 'Projects Completed', value: '50+', icon: '✅' },
  { label: 'Happy Clients', value: '30+', icon: '😊' },
  { label: 'Years Experience', value: '5+', icon: '📅' },
  { label: 'Technologies Mastered', value: '20+', icon: '🛠️' },
];

// ==================== API ENDPOINTS ====================

export const API_ENDPOINTS = {
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  projects: {
    list: '/api/projects',
    detail: (id: string) => `/api/projects/${id}`,
    create: '/api/projects',
    update: (id: string) => `/api/projects/${id}`,
    delete: (id: string) => `/api/projects/${id}`,
  },
  chat: {
    message: '/api/chat/message',
    conversation: (id: string) => `/api/chat/conversations/${id}`,
  },
  admin: {
    conversations: '/api/admin/conversations',
    messages: (id: string) => `/api/admin/messages/${id}`,
    stats: '/api/admin/stats',
    clients: {
      list: '/api/admin/clients',
      detail: (id: string) => `/api/admin/clients/${id}`,
      stats: (id: string) => `/api/admin/clients/${id}/stats`,
      activity: (id: string) => `/api/admin/clients/${id}/activity`,
      bulk: '/api/admin/clients/bulk',
    },
  },
  upload: '/api/upload',
  profile: '/api/profile',
};

// ==================== ROUTES ====================

export const ROUTES = {
  home: '/',
  projects: '/projects',
  projectDetail: (id: string) => `/projects/${id}`,
  contact: '/contact',
  about: '/about',
  admin: '/admin',
  dashboard: '/dashboard',
  dashboardConversations: '/dashboard/conversations',
  dashboardSettings: '/dashboard/settings',
  signup: '/signup',
  login: '/login',
};

// ==================== VALIDATION ====================

export const VALIDATION = {
  email: {
    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
  domain: {
    pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid domain (e.g., example.com)',
  },
  businessName: {
    minLength: 2,
    maxLength: 100,
    message: 'Business name must be between 2 and 100 characters',
  },
};

// ==================== UI CONSTANTS ====================

export const UI = {
  navbar: {
    height: '4rem',
    mobileHeight: '3.5rem',
  },
  footer: {
    height: '12rem',
  },
  container: {
    maxWidth: '1280px',
    padding: '1rem',
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ==================== THEME COLORS ====================

export const THEME_COLORS = {
  primary: {
    light: '#60A5FA', // blue-400
    DEFAULT: '#3B82F6', // blue-500
    dark: '#2563EB', // blue-600
  },
  secondary: {
    light: '#A78BFA', // purple-400
    DEFAULT: '#8B5CF6', // purple-500
    dark: '#7C3AED', // purple-600
  },
  accent: {
    light: '#FBBF24', // yellow-400
    DEFAULT: '#F59E0B', // yellow-500
    dark: '#D97706', // yellow-600
  },
  success: '#10B981', // green-500
  error: '#EF4444', // red-500
  warning: '#F59E0B', // yellow-500
  info: '#3B82F6', // blue-500
};

// ==================== MESSAGE TEMPLATES ====================

export const MESSAGE_TEMPLATES = {
  welcome: 'Welcome to {businessName}! How can I help you today?',
  offline: "I'm currently offline, but I'll get back to you soon!",
  error: 'Sorry, something went wrong. Please try again.',
  success: 'Thank you! Your message has been received.',
};

// ==================== CHATBOT CONFIG ====================

export const CHATBOT_CONFIG = {
  defaultTone: 'friendly' as const,
  defaultPosition: 'bottom-right' as const,
  defaultColor: THEME_COLORS.primary.DEFAULT,
  maxMessageLength: 500,
  typingDelay: 1000, // milliseconds
  messageDisplayLimit: 50,
};

// ==================== PAGINATION ====================

export const PAGINATION = {
  projectsPerPage: 12,
  conversationsPerPage: 20,
  messagesPerPage: 50,
};

// ==================== FILE UPLOAD ====================

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  acceptedVideoTypes: ['video/mp4', 'video/webm'],
  maxImages: 10,
  maxVideos: 3,
};

// ==================== CONTACT FORM ====================

export const CONTACT_FORM_TYPES = [
  { value: 'ai-chatbot', label: 'AI Chatbot Development' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'saas-platform', label: 'SaaS Platform' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'other', label: 'Other' },
] as const;

// ==================== SEO ====================

export const SEO = {
  defaultTitle: 'Sky Coding - AI Solutions & Web Development',
  defaultDescription: APP_DESCRIPTION,
  keywords: [
    'AI chatbot development',
    'web development',
    'Next.js',
    'React',
    'SaaS platform',
    'Zimbabwe developer',
    'custom software',
    'AI solutions',
  ],
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@skycodingjr',
};

// ==================== EXPORTS ====================

export default {
  APP_NAME,
  APP_TAGLINE,
  APP_DESCRIPTION,
  OWNER_INFO,
  SOCIAL_LINKS,
  PROJECT_CATEGORIES,
  BUSINESS_TYPES,
  TECH_STACK,
  SERVICES,
  FEATURED_SOLUTIONS,
  STATS,
  API_ENDPOINTS,
  ROUTES,
  VALIDATION,
  UI,
  THEME_COLORS,
  MESSAGE_TEMPLATES,
  CHATBOT_CONFIG,
  PAGINATION,
  FILE_UPLOAD,
  CONTACT_FORM_TYPES,
  SEO,
};
