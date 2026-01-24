import mongoose, { Document, Schema } from 'mongoose';

// Media interface for images and videos
interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string; // Cloudinary public ID for deletion
}

// Project interface
interface IProject extends Document {
  title: string;
  description: string;
  media: Media[];
  createdAt: Date;
  updatedAt: Date;
}

// Social links interface
interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

// Main User/Owner interface
export interface IUser extends Document {
  name: string;
  bio: string;
  email: string;
  password: string; // Hashed password
  role: 'admin' | 'user';
  avatar?: string;
  socialLinks: SocialLinks;
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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

// Project schema
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
    media: {
      type: [mediaSchema],
      validate: {
        validator: (v: Media[]) => v.length > 0,
        message: 'At least one media item is required',
      },
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
  },
  { _id: false },
);

// User schema
const userSchema = new Schema<IUser>(
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
      select: false, // Don't include password by default in queries
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    avatar: {
      type: String,
    },
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

// Check if models already exist before creating them
const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export { Project, User };
