'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserActions } from '@/components/UserAction';
import {
  ArrowLeft,
  Ban,
  Building2,
  Calendar,
  Globe,
  Loader2,
  Mail,
  MessageSquare,
  Shield,
  Trash2,
  TrendingUp,
  UserCheck,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserDetail {
  id: string;
  email: string;
  role: 'client' | 'admin';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    domain: string;
    businessType: string;
    plan: string;
    isActive: boolean;
    totalConversations: number;
    totalMessages: number;
  } | null;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        fetchUser(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleActivate = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        fetchUser(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleBlock = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Policy violation' }),
        credentials: 'include',
      });

      if (res.ok) {
        setShowBlockDialog(false);
        fetchUser(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='text-center spacing'>
        <h2 className='text-2xl font-bold text-gray-900'>User not found</h2>
        <Link href='/admin/users'>
          <Button variant='outline' className='mt-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='section-center spacing '>
      {/* Header */}
      <div className='spacing flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/users'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
          </Link>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-3xl font-bold text-gray-900'>{user.email}</h1>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' && <Shield className='h-3 w-3 mr-1' />}
                {user.role}
              </Badge>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? (
                  <>
                    <UserCheck className='h-3 w-3 mr-1' />
                    Active
                  </>
                ) : (
                  <>
                    <UserX className='h-3 w-3 mr-1' />
                    Suspended
                  </>
                )}
              </Badge>
            </div>
            <p className='text-gray-600 mt-1'>
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <UserActions
          isActive={user.isActive}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
          onDelete={() => setShowDeleteDialog(true)}
          onBlock={() => setShowBlockDialog(true)}
        />
      </div>

      {/* User Info Grid */}
      <div className='spacing grid gap-6 md:grid-cols-2'>
        {/* Account Information */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5' />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-gray-500'>Email</p>
              <p className='text-gray-900 font-medium'>{user.email}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Role</p>
              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                {user.role === 'admin' && <Shield className='h-3 w-3 mr-1' />}
                {user.role}
              </Badge>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Status</p>
              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                {user.isActive ? 'Active' : 'Suspended'}
              </Badge>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Last Login</p>
              <p className='text-gray-900'>{formatDate(user.lastLogin)}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Joined</p>
              <p className='text-gray-900'>{formatDate(user.createdAt)}</p>
            </div>

            <div>
              <p className='text-sm font-medium text-gray-500'>Last Updated</p>
              <p className='text-gray-900'>{formatDate(user.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {user.client ? (
              <>
                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Business Name
                  </p>
                  <p className='text-gray-900 font-medium'>
                    {user.client.name}
                  </p>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-500'>Domain</p>
                  <div className='flex items-center gap-2'>
                    <Globe className='h-4 w-4 text-gray-400' />
                    <p className='text-gray-900'>{user.client.domain}</p>
                  </div>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Business Type
                  </p>
                  <p className='text-gray-900 capitalize'>
                    {user.client.businessType}
                  </p>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-500'>Plan</p>
                  <Badge variant='secondary' className='capitalize'>
                    {user.client.plan}
                  </Badge>
                </div>

                <div>
                  <p className='text-sm font-medium text-gray-500'>
                    Client Status
                  </p>
                  <Badge
                    variant={user.client.isActive ? 'default' : 'secondary'}
                  >
                    {user.client.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className='pt-4 border-t'>
                  <Link href={`/admin/clients/${user.client.id}`}>
                    <Button variant='outline' size='sm' className='w-full'>
                      View Client Details
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className='text-center py-8'>
                <Building2 className='h-12 w-12 text-gray-300 mx-auto mb-2' />
                <p className='text-gray-500'>No business associated</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards (if client exists) */}
      {user.client && (
        <div className='spacing grid gap-6 md:grid-cols-2'>
          <Card className='spacing'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Conversations
              </CardTitle>
              <MessageSquare className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {user.client.totalConversations}
              </div>
              <p className='text-xs text-muted-foreground'>
                All chatbot conversations
              </p>
            </CardContent>
          </Card>

          <Card className='spacing'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Messages
              </CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {user.client.totalMessages}
              </div>
              <p className='text-xs text-muted-foreground'>
                Messages exchanged
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className='spacing'>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account and all associated
              data including their client and conversation history. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='btn'>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className='btn bg-red-600 hover:bg-red-700'
                onClick={handleDelete}
              >
                Delete User
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className='spacing'>
            <AlertDialogTitle>Block User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will suspend the user account and disable their chatbot. The
              user will not be able to log in or use the service. You can
              activate them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='btn'>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button className='btn' onClick={handleBlock}>
                Block User
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
