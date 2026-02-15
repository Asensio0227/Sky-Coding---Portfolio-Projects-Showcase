import mongoose, { Document, Schema } from 'mongoose';

// ==================== INTERFACES ====================

// Media interface for images and videos
interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string; // Cloudinary public ID for deletion
}

// Tech Stack interface (NEW)
interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  ai?: string[];
  auth?: string[];
  deployment?: string[];
  mobile?: string[];
  tools?: string[];
}

// Challenge interface (NEW)
interface Challenge {
  challenge: string;
  solution: string;
}

// Project interface (UPDATED)
interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string; // NEW - Detailed description
  category?: string[]; // NEW - ["AI Solutions", "SaaS", etc.]
  featured?: boolean; // NEW - Featured project flag
  status?: string; // NEW - "Production Ready", "Live Demo", etc.
  tagline?: string; // NEW - Short tagline

  media: Media[];

  // NEW - Enhanced project data
  features?: string[];
  techStack?: TechStack;
  challenges?: Challenge[];
  results?: string[];
  metrics?: Record<string, string>; // e.g., { setupTime: "< 5 min" }

  // NEW - Project meta
  year?: number;
  duration?: string; // e.g., "2 months"
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;

  // NEW - Problem & Solution
  problem?: string;
  solution?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Social links interface
interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

// Main Owner/Admin interface (your profile)
export interface IOwner extends Document {
  name: string;
  bio: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar?: string;
  socialLinks: SocialLinks;
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ==================== SCHEMAS ====================

// Media subdocument schema
const mediaSchema = new Schema<Media>(
  {
    url: {
      type: String,
      required: [true, 'Media URL is required'],
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: [true, 'Media type is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
  },
  { _id: false },
);

// Tech Stack subdocument schema (NEW)
const techStackSchema = new Schema<TechStack>(
  {
    frontend: [String],
    backend: [String],
    database: [String],
    ai: [String],
    auth: [String],
    deployment: [String],
    mobile: [String],
    tools: [String],
  },
  { _id: false },
);

// Challenge subdocument schema (NEW)
const challengeSchema = new Schema<Challenge>(
  {
    challenge: {
      type: String,
      required: true,
    },
    solution: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

// Project schema (UPDATED)
const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Project title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    longDescription: {
      type: String,
      maxlength: [5000, 'Long description cannot be more than 5000 characters'],
    },
    category: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'Completed',
    },
    tagline: {
      type: String,
      maxlength: [200, 'Tagline cannot be more than 200 characters'],
    },
    media: {
      type: [mediaSchema],
      validate: {
        validator: (v: Media[]) => v.length > 0,
        message: 'At least one media item is required',
      },
    },
    features: {
      type: [String],
      default: [],
    },
    techStack: {
      type: techStackSchema,
      default: () => ({}),
    },
    challenges: {
      type: [challengeSchema],
      default: [],
    },
    results: {
      type: [String],
      default: [],
    },
    metrics: {
      type: Map,
      of: String,
      default: new Map(),
    },
    year: {
      type: Number,
      min: 2000,
      max: 2100,
    },
    duration: String,
    demoUrl: String,
    githubUrl: String,
    caseStudyUrl: String,
    problem: {
      type: String,
      maxlength: [
        1000,
        'Problem description cannot be more than 1000 characters',
      ],
    },
    solution: {
      type: String,
      maxlength: [
        1000,
        'Solution description cannot be more than 1000 characters',
      ],
    },
  },
  { timestamps: true },
);

// Social links schema
const socialLinksSchema = new Schema<SocialLinks>(
  {
    whatsapp: {
      type: String,
      default: 'https://wa.me/263786974895',
    },
    facebook: {
      type: String,
      default: 'https://www.facebook.com/profile.php?id=61584322210511',
    },
    instagram: {
      type: String,
      default: 'https://www.instagram.com/skycodingjr/',
    },
    twitter: {
      type: String,
      default: 'https://x.com/skycodingjr',
    },
    linkedin: String,
    github: String,
  },
  { _id: false },
);

// Owner schema (renamed from User to avoid confusion with client users)
const ownerSchema = new Schema<IOwner>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    bio: {
      type: String,
      default: 'Sky Coding Professional',
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    avatar: String,
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
  },
  { timestamps: true },
);

// Add indexes for better query performance
projectSchema.index({ featured: 1, createdAt: -1 });
projectSchema.index({ category: 1 });

// Check if models already exist before creating them
const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
const Owner =
  mongoose.models.Owner || mongoose.model<IOwner>('Owner', ownerSchema);

export { Owner, Project };
export type { Challenge, IProject, Media, TechStack };
