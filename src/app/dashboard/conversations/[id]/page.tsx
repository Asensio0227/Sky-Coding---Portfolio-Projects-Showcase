'use client';

import MessageThread from '@/components/dashboard/MessageThread';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Message {
  _id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  visitorId: string;
  source: string;
  status: 'active' | 'resolved' | 'abandoned';
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
}

interface ConversationData {
  conversation: Conversation;
  messages: Message[];
}

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/messages/${conversationId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }

      const responseData = await res.json();
      setData(responseData.data || responseData);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const content = data.messages
      .map((msg) => `[${msg.role.toUpperCase()}] ${msg.content}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${conversationId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className='border-red-200 bg-red-50'>
        <CardContent className='pt-6'>
          <p className='text-red-600'>
            Error: {error || 'Conversation not found'}
          </p>
          <Link href='/dashboard/conversations'>
            <Button className='mt-4'>Back to Conversations</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const { conversation, messages } = data;

  return (
    <article className='section-center'>
      <div className='space-y-6 max-w-4xl mx-auto'>
        {/* Back Button */}
        <Link href='/dashboard/conversations'>
          <Button variant='ghost' size='sm'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Conversations
          </Button>
        </Link>

        {/* Conversation Header */}
        <Card>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div>
                <CardTitle className='text-2xl'>Conversation Details</CardTitle>
                <p className='text-sm text-gray-500 mt-2'>
                  ID: {conversation._id}
                </p>
              </div>
              <Badge
                variant={
                  conversation.status === 'active' ? 'default' : 'secondary'
                }
              >
                {conversation.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <p className='text-sm font-medium text-gray-500'>Visitor</p>
                <p className='text-gray-900'>
                  {conversation.visitorId || 'Anonymous'}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Source</p>
                <p className='text-gray-900 capitalize'>
                  {conversation.source}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Started</p>
                <p className='text-gray-900'>
                  {new Date(conversation.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>
                  Last Activity
                </p>
                <p className='text-gray-900'>
                  {new Date(conversation.lastMessageAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Messages ({messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageThread messages={messages} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={handleExport}>
            <Download className='h-4 w-4 mr-2' />
            Export Conversation
          </Button>
          <Button variant='destructive'>
            <Trash2 className='h-4 w-4 mr-2' />
            Delete Conversation
          </Button>
        </div>
      </div>
    </article>
  );
}
