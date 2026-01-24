import { hashPassword } from '@/lib/auth';
import { Project, User } from '@/models';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL || '';

const DEFAULT_PROJECTS = [
  {
    title: 'BiteRun - Food Delivery Platform',
    description:
      'Full-stack food delivery application with real-time order tracking, restaurant management, and integrated payment processing. Built with Next.js, MongoDB, and real-time WebSocket connections for live order updates. Features include AI-powered restaurant recommendations, smart route optimization for delivery drivers, and comprehensive analytics dashboard for restaurant owners.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_biterun_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_biterun_2',
      },
    ],
  },
  {
    title: 'Healthcare Management System',
    description:
      'Comprehensive healthcare platform enabling patient management, appointment scheduling, electronic health records (EHR), and telemedicine consultations. Implements HIPAA-compliant security standards, integrated prescription management, lab results tracking, and automated appointment reminders via SMS and email. Built with Next.js, TypeScript, and secure authentication.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_healthcare_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_healthcare_2',
      },
    ],
  },
  {
    title: 'Sky Housing - Real Estate Platform',
    description:
      'Modern property listing and management platform featuring advanced search filters, virtual property tours, mortgage calculator, and direct messaging between buyers and agents. Includes interactive maps powered by Google Maps API, saved searches with email alerts, property comparison tools, and comprehensive analytics for agents. Built with Next.js, Cloudinary for media management, and MongoDB.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_estate_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_estate_2',
      },
    ],
  },
  {
    title: 'AI-Powered Customer Support Chatbot',
    description:
      'Intelligent chatbot solution leveraging natural language processing and machine learning to handle customer inquiries 24/7. Features include multi-language support, sentiment analysis, automatic ticket escalation, conversation history, and integration with popular CRM systems. Reduces support costs by 60% while improving response times. Built with Next.js, Python backend for AI processing, and MongoDB for conversation storage.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_chatbot_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_chatbot_2',
      },
    ],
  },
  {
    title: 'E-Commerce Platform with Analytics',
    description:
      'Full-featured online store with inventory management, secure payment processing via Stripe, order tracking, and customer analytics dashboard. Includes wishlist functionality, product recommendations powered by AI, advanced filtering and search, multi-vendor support, and comprehensive admin dashboard. Built with Next.js, TypeScript, MongoDB, and integrated with Cloudinary for product images.',
    media: [
      {
        url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_ecommerce_1',
      },
      {
        url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop',
        type: 'image' as const,
        publicId: 'default_ecommerce_2',
      },
    ],
  },
];

// This is for running the seed script directly (npm run seed)
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin user exists
    let admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      // Create default admin user
      const hashedPassword = await hashPassword('admin123');
      admin = await User.create({
        name: 'Sky Coding Admin',
        email: 'admin@skycoding.com',
        password: hashedPassword,
        role: 'admin',
        bio: 'Sky Coding - Professional Software Development',
        socialLinks: {
          whatsapp: 'https://wa.me/263786974895',
          facebook: 'https://www.facebook.com/profile.php?id=61584322210511',
          instagram: 'https://www.instagram.com/skycodingjr/',
          twitter: 'https://x.com/skycodingjr',
        },
      });
      console.log('✓ Created default admin user');
    }

    // Check if projects exist
    const existingProjects = await Project.countDocuments();

    if (existingProjects === 0) {
      // Create default projects
      const projects = await Project.insertMany(DEFAULT_PROJECTS);
      console.log(`✓ Created ${projects.length} default projects`);

      // Add projects to admin user
      admin.projects = projects.map((p: any) => p._id);
      await admin.save();
      console.log('✓ Associated projects with admin user');
    } else {
      console.log(`✓ Database already contains ${existingProjects} projects`);
    }

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

// Only run seedDatabase if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

// This is for auto-seeding when API is called
export async function ensureDefaultContent() {
  try {
    // Database is already connected by the route
    const projectCount = await Project.countDocuments();

    if (projectCount === 0) {
      console.log('📦 No projects found, creating defaults...');

      // Create default projects
      const projects = await Project.insertMany(DEFAULT_PROJECTS);
      console.log(`✅ Created ${projects.length} default projects`);

      // Find or create admin user
      let admin = await User.findOne({ role: 'admin' });

      if (!admin) {
        const hashedPassword = await hashPassword('admin123');
        admin = await User.create({
          name: 'Sky Coding Admin',
          email: 'admin@skycoding.com',
          password: hashedPassword,
          role: 'admin',
          bio: 'Sky Coding - Professional Software Development',
          socialLinks: {
            whatsapp: 'https://wa.me/263786974895',
            facebook: 'https://www.facebook.com/profile.php?id=61584322210511',
            instagram: 'https://www.instagram.com/skycodingjr/',
            twitter: 'https://x.com/skycodingjr',
          },
        });
        console.log('✅ Created default admin user');
      }

      // Add projects to admin user
      admin.projects = projects.map((p: any) => p._id);
      await admin.save();
      console.log('✅ Associated projects with admin user');
    } else {
      console.log(`✓ Found ${projectCount} existing projects`);
    }
  } catch (error) {
    console.error('❌ ensureDefaultContent error:', error);
    // Don't throw - let the app continue even if seeding fails
  }
}

export default seedDatabase;
