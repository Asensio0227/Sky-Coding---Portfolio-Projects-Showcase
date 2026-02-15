'use client';

import ConversationList from '@/components/dashboard/ConversationList';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Filter, Loader2, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Conversation {
  _id: string;
  visitorId: string;
  source: string;
  status: 'active' | 'resolved' | 'abandoned';
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/conversations', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await res.json();

      // Handle different response formats
      console.log('API Response:', data);

      // Extract array from response
      const conversationsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];

      setConversations(conversationsArray);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Safely filter conversations
  const filteredConversations = Array.isArray(conversations)
    ? conversations.filter((conv) => {
        if (filter === 'all') return true;
        return conv.status === filter;
      })
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className='border-red-200 bg-red-50'>
        <CardContent className='pt-6'>
          <p className='text-red-600'>Error: {error}</p>
          <Button onClick={fetchConversations} className='mt-4'>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const totalConversations = conversations.length;
  const activeCount = conversations.filter((c) => c.status === 'active').length;
  const resolvedCount = conversations.filter(
    (c) => c.status === 'resolved',
  ).length;

  return (
    <article className='section-center'>
      <div className='spacing section footer'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='footer text-3xl font-bold text-gray-900'>
              Chat History
            </h1>
            <p className='text-gray-600 mt-1'>
              View all chatbot conversations from your website
            </p>
          </div>
          <Badge variant='secondary' className='text-lg px-4 py-2 w-fit'>
            {totalConversations} Total
          </Badge>
        </div>

        {/* Filters */}
        <Card className='spacing '>
          <CardHeader>
            <CardTitle className='spacing text-lg flex items-center'>
              <Filter className='h-5 w-5 mr-2' />
              Filter Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter('all')}
              >
                All ({totalConversations})
              </Button>
              <Button
                variant={filter === 'active' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter('active')}
              >
                Active ({activeCount})
              </Button>
              <Button
                variant={filter === 'resolved' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setFilter('resolved')}
              >
                Resolved ({resolvedCount})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <Card className='spacing'>
            <CardContent className='pt-6 text-center py-12'>
              <MessageSquare className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                {totalConversations === 0
                  ? 'No conversations yet'
                  : `No ${filter} conversations`}
              </h3>
              <p className='text-gray-600'>
                {totalConversations === 0
                  ? 'Conversations will appear here once visitors start chatting'
                  : `Try a different filter to see other conversations`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ConversationList
            conversations={filteredConversations}
            formatDate={formatDate}
          />
        )}
      </div>
    </article>
  );
}
