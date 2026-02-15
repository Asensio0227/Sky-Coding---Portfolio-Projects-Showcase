import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string; // Hashed with bcrypt
  clientId?: mongoose.Types.ObjectId; // Link to their business (optional until signup complete)
  role: 'client' | 'admin';
  status: 'activate' | 'suspend' | 'ban' | 'block' | 'active';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false, // Optional - will be set during signup
    },
    role: {
      type: String,
      enum: ['client', 'admin'],
      default: 'client',
    },
    status: {
      type: String,
      enum: ['activate', 'suspend', 'ban', 'block', 'active'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ clientId: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Method to check if user is admin
userSchema.methods.isAdmin = function (): boolean {
  return this.role === 'admin';
};

// Method to check if user is client
userSchema.methods.isClient = function (): boolean {
  return this.role === 'client';
};

// Prevent model recompilation in development
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
