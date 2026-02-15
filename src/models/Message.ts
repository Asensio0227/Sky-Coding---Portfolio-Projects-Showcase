import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  clientId: mongoose.Types.ObjectId; // New primary tenant identifier
  restaurantId: mongoose.Types.ObjectId; // TEMPORARY: backwards compatibility
  conversationId: mongoose.Types.ObjectId; // Which conversation

  role: 'user' | 'assistant' | 'system';
  content: string;

  // AI metadata (optional)
  aiMetadata?: {
    model?: string; // e.g., "gpt-4", "claude-3"
    tokensUsed?: number;
    responseTime?: number; // milliseconds
    confidence?: number; // 0-1
  };

  // Message state
  isRead: boolean;
  isFlagged: boolean; // For moderation/review

  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true, // Critical for tenant isolation
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true, // TEMP: compatibility
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    aiMetadata: {
      model: String,
      tokensUsed: {
        type: Number,
        min: 0,
      },
      responseTime: {
        type: Number,
        min: 0,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isFlagged: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for fast multi-tenant queries
messageSchema.index({ conversationId: 1, createdAt: 1 }); // Get messages in order
messageSchema.index({ clientId: 1, createdAt: -1 }); // Recent messages per client
messageSchema.index({ clientId: 1, isFlagged: 1 }); // Flagged messages per tenant
messageSchema.index({ clientId: 1, role: 1, createdAt: -1 }); // Filter by role per tenant

// legacy indexes for clientId
messageSchema.index({ clientId: 1, createdAt: -1 });
messageSchema.index({ clientId: 1, isFlagged: 1 });
messageSchema.index({ clientId: 1, role: 1, createdAt: -1 });

// Method to mark as read
messageSchema.methods.markAsRead = async function () {
  this.isRead = true;
  await this.save();
};

// Method to flag message
messageSchema.methods.flag = async function () {
  this.isFlagged = true;
  await this.save();
};

// Static method to get conversation history
messageSchema.statics.getConversationHistory = function (
  conversationId: string,
  limit = 50,
) {
  return this.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .select('-clientId -clientId'); // omit tenant ids
};

const Message =
  mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
