import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  // New multitenant identifier. Clients are the new primary tenant objects.
  clientId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId; // TEMPORARY: backward compatibility
  visitorId: string; // Anonymous visitor identifier (UUID or session ID)
  source: 'website' | 'whatsapp' | 'facebook' | 'instagram' | 'mobile';

  // Metadata
  visitorInfo?: {
    userAgent?: string;
    ip?: string;
    country?: string;
    city?: string;
  };

  // Conversation state
  status: 'active' | 'resolved' | 'abandoned';
  messageCount: number;

  // Timestamps
  createdAt: Date;
  lastMessageAt: Date;
  resolvedAt?: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true, // Critical for tenant isolation queries
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true, // Keep for backwards compatibility
    },
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'facebook', 'instagram', 'mobile'],
      default: 'website',
    },
    visitorInfo: {
      userAgent: String,
      ip: String,
      country: String,
      city: String,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'abandoned'],
      default: 'active',
      index: true,
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient multi-tenant queries
conversationSchema.index({ clientId: 1, createdAt: -1 }); // Recent conversations per tenant
conversationSchema.index({ clientId: 1, status: 1 }); // Active/resolved per tenant
conversationSchema.index({ clientId: 1, lastMessageAt: -1 }); // Last activity per tenant
conversationSchema.index({ visitorId: 1, clientId: 1 }); // Find visitor's conversations per tenant
conversationSchema.index({ clientId: 1, status: 1, lastMessageAt: -1 }); // Dashboard queries

// maintain old indexes temporarily for compatibility
conversationSchema.index({ clientId: 1, createdAt: -1 });
conversationSchema.index({ clientId: 1, status: 1 });
conversationSchema.index({ clientId: 1, lastMessageAt: -1 });
conversationSchema.index({ visitorId: 1, clientId: 1 });
conversationSchema.index({ clientId: 1, status: 1, lastMessageAt: -1 });

// Method to mark as resolved
conversationSchema.methods.markResolved = async function () {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  await this.save();
};

// Method to mark as abandoned (e.g., no activity for 24h)
conversationSchema.methods.markAbandoned = async function () {
  this.status = 'abandoned';
  await this.save();
};

// Static method to find active conversation for visitor
conversationSchema.statics.findActiveForVisitor = function (
  clientId: string,
  visitorId: string,
  inactiveParam?: string, // keep optional for backwards compatibility
) {
  const query: any = { visitorId, status: 'active' };
  if (clientId) query.clientId = clientId;
  if (inactiveParam) query.restaurantId = inactiveParam;
  return this.findOne(query).sort({ lastMessageAt: -1 });
};

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
