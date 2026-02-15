// src/app/admin/clients/[id]/page.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Globe,
  Loader2,
  MessageSquare,
  Trash2,
  TrendingUp,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ClientDetail {
  id: string;
  name: string;
  domain: string;
  allowedDomains: string[];
  businessType: string;
  description: string;
  owner: {
    id: string;
    email: string;
    isActive: boolean;
    createdAt: string;
  } | null;
  chatbotConfig: {
    welcomeMessage: string;
    tone: string;
    enabled: boolean;
    primaryColor: string;
    position: string;
  };
  plan: string;
  isActive: boolean;
  stats: {
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
    resolvedConversations: number;
    averageMessagesPerConversation: number;
  };
  recentConversations: any[];
  createdAt: string;
  updatedAt: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setClient(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this client? This action cannot be undone.',
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/admin/clients');
      }
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className='section-center spacing'>
      {/* Header */}
      <div className='spacing flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/clients'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              {client.name}
            </h1>
            <p className='text-gray-600 mt-1'>{client.domain}</p>
          </div>
        </div>
        <div className='flex gap-2'>
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Button variant='outline'>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </Button>
          </Link>

          <Button variant='destructive' onClick={handleDelete}>
            <Trash2 className='h-4 w-4 mr-2' />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='spacing grid gap-6 md:grid-cols-4'>
        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Chats</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {client.stats.totalConversations}
            </div>
            <p className='text-xs text-muted-foreground'>
              {client.stats.activeConversations} active
            </p>
          </CardContent>
        </Card>

        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Messages</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {client.stats.totalMessages}
            </div>
            <p className='text-xs text-muted-foreground'>
              ~{client.stats.averageMessagesPerConversation} per chat
            </p>
          </CardContent>
        </Card>

        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Plan</CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold capitalize'>
              {client.plan}
            </div>
            <Badge
              variant={client.isActive ? 'default' : 'secondary'}
              className='mt-2'
            >
              {client.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>

        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Chatbot</CardTitle>
            <Globe className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {client.chatbotConfig.enabled ? 'Enabled' : 'Disabled'}
            </div>
            <p className='text-xs text-muted-foreground capitalize'>
              {client.chatbotConfig.tone} tone
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details Cards */}
      <div className='spacing grid gap-6 md:grid-cols-2'>
        {/* Client Info */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-gray-500'>Business Type</p>
              <p className='text-gray-900 capitalize'>
                {client.businessType || 'Not specified'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Description</p>
              <p className='text-gray-900'>
                {client.description || 'No description'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>
                Allowed Domains
              </p>
              <div className='flex flex-wrap gap-2 mt-1'>
                {client.allowedDomains.map((domain, idx) => (
                  <Badge key={idx} variant='secondary'>
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Created</p>
              <p className='text-gray-900'>
                {new Date(client.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {client.owner ? (
              <>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Email</p>
                  <p className='text-gray-900'>{client.owner.email}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>Status</p>
                  <Badge
                    variant={
                      client.owner.isActive ? 'default' : 'secondary'
                    }
                  >
                    {client.owner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Member Since
                  </p>
                  <p className='text-gray-900'>
                    {new Date(client.owner.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Link href={`/admin/users/${client.owner.id}`}>
                    <Button variant='outline' size='sm'>
                      View User Profile
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <p className='text-gray-500'>No owner assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Config */}
      <Card className='spacing'>
        <CardHeader>
          <CardTitle>Chatbot Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <p className='text-sm font-medium text-gray-500'>
                Welcome Message
              </p>
              <p className='text-gray-900'>
                {client.chatbotConfig.welcomeMessage}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Position</p>
              <p className='text-gray-900 capitalize'>
                {client.chatbotConfig.position}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Primary Color</p>
              <div className='flex items-center gap-2'>
                <div
                  className='w-8 h-8 rounded border'
                  style={{
                    backgroundColor: client.chatbotConfig.primaryColor,
                  }}
                />
                <span className='text-gray-900'>
                  {client.chatbotConfig.primaryColor}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Conversations */}
      <Card className='spacing'>
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
          <CardDescription>Latest chat activity</CardDescription>
        </CardHeader>
        <CardContent>
          {client.recentConversations.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>
              No recent conversations
            </p>
          ) : (
            <div className='space-y-3'>
              {client.recentConversations.map((conv) => (
                <div
                  key={conv._id}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <div>
                    <p className='font-medium'>Visitor: {conv.visitorId}</p>
                    <p className='text-sm text-gray-500'>
                      {conv.messageCount} messages
                    </p>
                  </div>
                  <Badge
                    variant={conv.status === 'active' ? 'default' : 'secondary'}
                  >
                    {conv.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
