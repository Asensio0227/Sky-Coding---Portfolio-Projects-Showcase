'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IClient } from '@/models/Client';
import { IUser } from '@/models/User';
import {
  Building2,
  Loader2,
  MessageSquare,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ClientStats {
  totalConversations: number;
  totalMessages: number;
  activeConversations: number;
}

interface ClientData {
  id: string;
  name: string;
  isActive: boolean;
  stats: ClientStats;
}

interface UserData {
  id: string;
  email: string;
  isActive: boolean;
}

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalUsers: number;
  activeUsers: number;
  totalConversations: number;
  totalMessages: number;
  recentActivity: {
    type: string;
    description: string;
    timestamp: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch clients
      const clientsRes = await fetch('/api/admin/clients', {
        credentials: 'include',
      });
      const clientsData = await clientsRes.json();

      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        credentials: 'include',
      });
      const usersData = await usersRes.json();

      const clients = clientsData.data?.clients || [];
      const users = usersData.data?.users || [];

      // Calculate stats
      setStats({
        totalClients: clientsData.data?.total || 0,
        activeClients: clients.filter((r: ClientData) => r.isActive)
          .length,
        totalUsers: usersData.data?.pagination.total || 0,
        activeUsers: users.filter((u: UserData) => u.isActive).length,
        totalConversations: clients.reduce(
          (sum: number, r: ClientData) =>
            sum + (r.stats?.totalConversations || 0),
          0,
        ),
        totalMessages: clients.reduce(
          (sum: number, r: ClientData) =>
            sum + (r.stats?.totalMessages || 0),
          0,
        ),
        recentActivity: [],
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className='section-center spacing'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard Overview</h1>
        <p className='text-gray-600 mt-1'>Welcome to the admin control panel</p>
      </div>

      {/* Stats Grid */}
      <div className='spacing grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Clients
            </CardTitle>
            <Building2 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalClients}</div>
            <p className='text-xs text-muted-foreground'>
              {stats.activeClients} active
            </p>
          </CardContent>
        </Card>

        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalUsers}</div>
            <p className='text-xs text-muted-foreground'>
              {stats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card className='spacing'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Conversations
            </CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalConversations}</div>
            <p className='text-xs text-muted-foreground'>
              {stats.totalMessages} messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='spacing'>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <Link
              href='/admin/clients'
              className='spacing flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition'
            >
              <Building2 className='h-8 w-8 text-blue-600 mr-3' />
              <div>
                <p className='spacing font-semibold'>Manage Clients</p>
                <p className='text-sm text-gray-600'>
                  View and edit all clients
                </p>
              </div>
            </Link>
            <Link
              href='/admin/users'
              className='spacing flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition'
            >
              <Users className='h-8 w-8 text-purple-600 mr-3' />
              <div>
                <p className='spacing font-semibold'>Manage Users</p>
                <p className='text-sm text-gray-600'>
                  View and manage user accounts
                </p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
