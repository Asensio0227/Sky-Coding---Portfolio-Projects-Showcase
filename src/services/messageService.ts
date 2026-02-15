import Client, { IClient } from '@/models/Client';
import Message from '@/models/Message';
import mongoose from 'mongoose';

function assertClientId(clientId?: string) {
  if (!clientId) {
    throw new Error('clientId is required');
  }
}

/**
 * Retrieve client and validate subscription state before allowing further actions.
 * Throws an Error with statusCode property for HTTP handling.
 */
interface ServiceError extends Error {
  statusCode?: number;
}

async function ensureClientCanSend(clientId: string): Promise<IClient> {
  const client = await Client.findById(clientId).exec();
  if (!client) {
    const err: ServiceError = new Error('Client not found');
    err.statusCode = 404;
    throw err;
  }

  if (!client.isActive || client.subscriptionStatus !== 'active') {
    const err: ServiceError = new Error('Subscription inactive or cancelled');
    err.statusCode = 403;
    throw err;
  }

  // pro plan has unlimited messages
  if (client.plan !== 'pro') {
    if (client.usageCount >= client.messageLimit) {
      const err: ServiceError = new Error('Message limit exceeded');
      err.statusCode = 429;
      throw err;
    }
  }

  return client;
}

export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Create a new message associated with a client/client/conversation.
 */
export async function createMessage(
  clientId: string,
  restaurantId: string,
  conversationId: string,
  role: MessageRole,
  content: string,
  aiMetadata?: Record<string, unknown>,
) {
  assertClientId(clientId);
  if (!restaurantId || !conversationId || !role || !content) {
    throw new Error('Missing required message fields');
  }

  // subscription checks
  const client = await ensureClientCanSend(clientId);

  const message = await Message.create({
    clientId: new mongoose.Types.ObjectId(clientId),
    restaurantId: new mongoose.Types.ObjectId(restaurantId),
    conversationId: new mongoose.Types.ObjectId(conversationId),
    role,
    content,
    aiMetadata,
    isRead: false,
    isFlagged: false,
  });

  // bump usage counters (do this asynchronously, but don't await to keep latency low)
  if (client.plan !== 'pro') {
    Client.findByIdAndUpdate(clientId, {
      $inc: { usageCount: 1, totalMessages: 1 },
    }).exec();
  } else {
    // still track total messages for analytics
    Client.findByIdAndUpdate(clientId, { $inc: { totalMessages: 1 } }).exec();
  }

  return message;
}

/**
 * Retrieve messages for a conversation; tenant isolation is enforced
 * automatically by filtering on clientId.
 */
export async function getConversationMessages(
  clientId: string,
  conversationId: string,
) {
  assertClientId(clientId);
  if (!conversationId) throw new Error('conversationId is required');

  return Message.find({
    clientId: new mongoose.Types.ObjectId(clientId),
    conversationId: new mongoose.Types.ObjectId(conversationId),
  })
    .sort({ createdAt: 1 })
    .select('-restaurantId -clientId');
}
