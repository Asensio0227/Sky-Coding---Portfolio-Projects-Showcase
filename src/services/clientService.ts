import Client, { IClient } from '@/models/Client';

/**
 * Ensure a client exists and is active. Throws if validation fails.
 *
 * @param clientId - tenant identifier coming from the request
 * @returns the client document (used as "client")
 */
export async function verifyClient(clientId?: string): Promise<IClient> {
  if (!clientId) {
    throw new Error('clientId is required');
  }

  const client = await Client.findById(clientId);
  if (!client) {
    const err = new Error('Invalid clientId') as Error & { status?: number };
    err.status = 404;
    throw err;
  }

  if (!client.isActive) {
    const err = new Error('Client is not active') as Error & {
      status?: number;
    };
    err.status = 403;
    throw err;
  }

  return client;
}

/**
 * Increment usage statistics on the client document. The caller is
 * responsible for deciding how many messages/conversations to bump.
 */
export async function incrementStats(
  clientId: string,
  messages = 0,
  conversations = 0,
) {
  if (!clientId) throw new Error('clientId is required');

  await Client.findByIdAndUpdate(clientId, {
    $inc: {
      totalMessages: messages,
      totalConversations: conversations,
    },
  });
}
