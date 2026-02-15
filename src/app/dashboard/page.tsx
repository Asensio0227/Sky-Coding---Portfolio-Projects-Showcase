import ScriptCopy from '@/components/dashboard/ScriptCopy';
import StatsCard from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  MessageSquare,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Stats {
  totalConversations: number;
  totalMessages: number;
  activeConversations: number;
  resolvedConversations: number;
  averageMessagesPerConversation: number;
}

interface UserData {
  id: string;
  email: string;
  role: 'client' | 'admin';
  clientId?: string;
  client?: {
    id: string;
    name: string;
    domain: string;
    clientId: string;
    plan: string;
  };
}

/**
 * Server component – data fetched on the server using the same APIs as the client
 */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    redirect('/login');
  }

  // fetch user and stats from our own API endpoints
  const [meRes, statsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/auth/me`, {
      headers: { cookie: `auth_token=${token}` },
      cache: 'no-store',
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/dashboard/stats`, {
      headers: { cookie: `auth_token=${token}` },
      cache: 'no-store',
    }),
  ]);

  const meData = await meRes.json();
  if (!meRes.ok || !meData.success || !meData.user) {
    redirect('/login');
  }
  const user: UserData = meData.user;

  const statsData = await statsRes.json();
  const stats: Stats =
    statsData.success && statsData.data
      ? statsData.data
      : {
          totalConversations: 0,
          totalMessages: 0,
          activeConversations: 0,
          resolvedConversations: 0,
          averageMessagesPerConversation: 0,
        };

  return (
    <article className='section-center'>
      <div className='spacing section footer'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='text-gray-600 mt-1'>
            Welcome back! Here's what's happening with your chatbot.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Total Conversations'
            value={stats.totalConversations}
            icon={MessageSquare}
            description='All time conversations'
            trend={
              stats.totalConversations > 0
                ? `${stats.activeConversations} active`
                : 'Get started'
            }
          />
          <StatsCard
            title='Total Messages'
            value={stats.totalMessages}
            icon={TrendingUp}
            description='Messages exchanged'
            trend={
              stats.averageMessagesPerConversation > 0
                ? `~${stats.averageMessagesPerConversation} avg per chat`
                : 'No data yet'
            }
          />
          <StatsCard
            title='Active Chats'
            value={stats.activeConversations}
            icon={Clock}
            description='Currently active'
            trend='Live now'
          />
          <StatsCard
            title='Resolved'
            value={stats.resolvedConversations}
            icon={CheckCircle}
            description='Completed chats'
            trend={
              stats.totalConversations > 0
                ? `${Math.round((stats.resolvedConversations / stats.totalConversations) * 100)}% resolution rate`
                : 'No data yet'
            }
            valueColor='text-green-600'
          />
        </div>

        {/* Chatbot Script */}
        {user.clientId && <ScriptCopy clientId={user.clientId} />}

        {/* Quick Actions */}
        <Card>
          <CardHeader className='spacing'>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='spacing grid gap-4 md:grid-cols-2'>
              <Link href='/dashboard/conversations'>
                <Button variant='outline' className='w-full justify-start'>
                  <MessageSquare className='mr-2 h-4 w-4' />
                  View All Conversations
                </Button>
              </Link>
              <Link href='/dashboard/settings'>
                <Button variant='outline' className='w-full justify-start'>
                  <Settings className='mr-2 h-4 w-4' />
                  Customize Chatbot
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
