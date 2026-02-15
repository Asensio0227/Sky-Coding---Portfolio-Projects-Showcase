import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import mongoose from 'mongoose';

function assertClientId(clientId?: string) {
  if (!clientId) {
    throw new Error('clientId is required');
  }
}

export interface ConversationFilter {
  status?: 'active' | 'resolved' | 'abandoned';
}

/**
 * List conversations for a given client. Filters are automatically
 * scoped by clientId to enforce tenant isolation.
 */
export async function listConversations(
  clientId: string,
  opts: ConversationFilter = {},
) {
  assertClientId(clientId);
  const query: mongoose.FilterQuery<typeof Conversation> = {
    clientId: new mongoose.Types.ObjectId(clientId),
  };
  if (opts.status) query.status = opts.status;

  return Conversation.find(query).sort({ lastMessageAt: -1 }).limit(50);
}

/**
 * Fetch a single conversation along with its messages. Returns null if not
 * found or not owned by the client.
 */
export async function getConversationDetail(
  clientId: string,
  conversationId: string,
) {
  assertClientId(clientId);
  if (!conversationId) {
    throw new Error('conversationId is required');
  }

  const conv = await Conversation.findOne({
    _id: conversationId,
    clientId: new mongoose.Types.ObjectId(clientId),
  });
  if (!conv) {
    return null;
  }

  const messages = await Message.find({
    conversationId: conv._id,
    clientId: new mongoose.Types.ObjectId(clientId),
  })
    .sort({ createdAt: 1 })
    .select('-clientId -clientId');

  return { conversation: conv, messages };
}

/**
 * Either fetch an active conversation for the visitor or create a new one.
 */
export async function getOrCreateConversation(
  clientId: string,
  restaurantId: string,
  visitorId?: string,
  source: string = 'website',
) {
  assertClientId(clientId);
  if (!restaurantId) {
    throw new Error('restaurantId is required');
  }

  const visitor =
    visitorId ||
    `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  let conversation = await Conversation.findOne({
    clientId: new mongoose.Types.ObjectId(clientId),
    visitorId: visitor,
    status: 'active',
  }).sort({ lastMessageAt: -1 });

  if (!conversation) {
    conversation = await Conversation.create({
      clientId: new mongoose.Types.ObjectId(clientId),
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      visitorId: visitor,
      source,
      status: 'active',
      messageCount: 0,
      lastMessageAt: new Date(),
    });
  }

  return conversation;
}

/**
 * Update conversation counters (message count and lastMessageAt).
 */
export async function bumpConversationActivity(
  conversationId: string,
  clientId: string,
  increment = 1,
) {
  assertClientId(clientId);
  if (!conversationId) throw new Error('conversationId is required');

  return Conversation.findOneAndUpdate(
    { _id: conversationId, clientId: new mongoose.Types.ObjectId(clientId) },
    {
      $inc: { messageCount: increment },
      $set: { lastMessageAt: new Date() },
    },
    { new: true },
  );
}
