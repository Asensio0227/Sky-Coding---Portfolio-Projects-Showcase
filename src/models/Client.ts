import mongoose, { Document, Schema } from 'mongoose';

// Chatbot configuration interface
interface ChatbotConfig {
  welcomeMessage: string;
  tone: 'professional' | 'friendly' | 'casual';
  enabled: boolean;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export interface IClient extends Document {
  userId: mongoose.Types.ObjectId; // Link to User account (owner)
  name: string; // Business name
  domain: string; // Normalized website domain (no protocol, no www)
  allowedDomains: string[]; // Security: only these domains can use chatbot

  // Business details
  businessType?: 'hotel' | 'client' | 'cafe' | 'resort' | 'other';
  description?: string;

  // Chatbot configuration
  chatbotConfig: ChatbotConfig;

  // Subscription/Plan
  plan: 'starter' | 'business' | 'pro';
  isActive: boolean;

  // subscription details for SaaS pricing
  messageLimit: number;
  usageCount: number;
  subscriptionStatus: 'active' | 'past_due' | 'cancelled';

  // Stats (updated by triggers/jobs)
  totalConversations: number;
  totalMessages: number;

  createdAt: Date;
  updatedAt: Date;
}

const chatbotConfigSchema = new Schema<ChatbotConfig>(
  {
    welcomeMessage: {
      type: String,
      default: 'Hello! How can I help you today?',
      maxlength: [200, 'Welcome message cannot exceed 200 characters'],
    },
    tone: {
      type: String,
      enum: ['professional', 'friendly', 'casual'],
      default: 'friendly',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    primaryColor: {
      type: String,
      default: '#3B82F6', // Blue
      match: [/^#[0-9A-F]{6}$/i, 'Invalid hex color'],
    },
    position: {
      type: String,
      enum: ['bottom-right', 'bottom-left'],
      default: 'bottom-right',
    },
  },
  { _id: false },
);

const clientSchema = new Schema<IClient>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      // index: true,
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    domain: {
      type: String,
      required: [true, 'Website domain is required'],
      trim: true,
      lowercase: true,
      unique: true,
      // index defined below; remove inline index attribute to avoid duplicates
      validate: {
        validator: function (v: string) {
          // Ensure no protocol, no www, no paths
          return (
            !v.includes('http') &&
            !v.includes('www.') &&
            !v.includes('/') &&
            /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/.test(v)
          );
        },
        message:
          'Invalid domain format. Use format: example.com (no http, www, or paths)',
      },
    },
    allowedDomains: {
      type: [String],
      default: function (this: IClient) {
        return [this.domain];
      },
    },
    businessType: {
      type: String,
      enum: ['hotel', 'client', 'cafe', 'resort', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    chatbotConfig: {
      type: chatbotConfigSchema,
      default: () => ({}),
    },
    plan: {
      type: String,
      enum: ['starter', 'business', 'pro'], // starter replaces previous free/basic
      default: 'starter',
    },
    // keeps the existing flag for active subscription
    isActive: {
      type: Boolean,
      default: true,
    },
    // message quota information for SaaS
    messageLimit: {
      type: Number,
      required: true,
      default: 1000, // starter default, can be adjusted when plan is changed
      min: 0,
    },
    usageCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'past_due', 'cancelled'],
      default: 'active',
    },
    totalConversations: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalMessages: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
clientSchema.index({ userId: 1 }, { unique: true }); // One client per user
// domain field already has `unique: true`, no need for a second index
clientSchema.index({ isActive: 1 });
clientSchema.index({ plan: 1 });

// Virtual for client ID (this is what goes in data-client-id)
clientSchema.virtual('clientId').get(function () {
  return this._id.toString();
});

// Method to check if domain is allowed
clientSchema.methods.isDomainAllowed = function (domain: string): boolean {
  const normalizedDomain =
    domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0] || '';
  return this.allowedDomains.includes(normalizedDomain);
};

// Static method to normalize domain
clientSchema.statics.normalizeDomain = function (domain: string): string {
  return (
    domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '') // Remove protocol and www
      .split('/')[0] || ''
  ) // Remove paths
    .trim();
};

// Ensure virtuals are included in JSON
clientSchema.set('toJSON', { virtuals: true });
clientSchema.set('toObject', { virtuals: true });

const Client =
  mongoose.models.Client || mongoose.model<IClient>('Client', clientSchema);

export default Client;
