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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Search,
  Shield,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: 'client' | 'admin';
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    domain: string;
    plan: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter, activeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (roleFilter && roleFilter !== 'all') {
        params.append('role', roleFilter);
      }

      if (activeFilter && activeFilter !== 'all') {
        params.append('isActive', activeFilter);
      }

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination({ ...pagination, page: 1 }); // Reset to page 1
  };

  const handleSuspend = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='section-center spacing'>
      {/* Header */}
      <div className='spacing flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <Users className='h-8 w-8' />
            User Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage all user accounts and permissions
          </p>
        </div>
        <Badge variant='secondary' className='text-lg px-4 py-2 w-fit'>
          {pagination.total} Total Users
        </Badge>
      </div>

      {/* Filters */}
      <Card className='spacing'>
        <CardHeader>
          <CardTitle className='text-lg'>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search by email...'
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className='pl-9'
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder='All Roles' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value='client'>Client</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger>
                <SelectValue placeholder='All Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='true'>Active</SelectItem>
                <SelectItem value='false'>Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className='spacing'>
        <CardHeader className='spacing'>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {pagination.total} total users •{' '}
            {users.filter((u) => u.isActive).length} active •{' '}
            {users.filter((u) => !u.isActive).length} suspended
          </CardDescription>
        </CardHeader>
        <CardContent className='spacing'>
          <div className='rounded-md border overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow className='spacing'>
                    <TableCell colSpan={7} className='text-center py-8'>
                      <p className='text-gray-500'>No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      {/* Email */}
                      <TableCell className='font-medium'>
                        {user.email}
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge
                          variant={
                            user.role === 'admin' ? 'default' : 'secondary'
                          }
                        >
                          {user.role === 'admin' && (
                            <Shield className='h-3 w-3 mr-1' />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>

                      {/* Business */}
                      <TableCell>
                        {user.client ? (
                          <div className='flex items-center gap-2'>
                            <Building2 className='h-4 w-4 text-gray-400' />
                            <div>
                              <p className='font-medium text-sm'>
                                {user.client.name}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {user.client.domain}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className='text-gray-400 text-sm'>
                            No business
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={user.isActive ? 'default' : 'destructive'}
                        >
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
                      </TableCell>

                      {/* Last Login */}
                      <TableCell className='text-sm text-gray-600'>
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </TableCell>

                      {/* Joined */}
                      <TableCell className='text-sm text-gray-600'>
                        {formatDate(user.createdAt)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className='text-right spacing '>
                        <div className='flex items-center justify-end gap-2'>
                          <Link href={`/admin/users/${user.id}`}>
                            <Button variant='ghost' size='sm'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </Link>

                          {user.isActive ? (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleSuspend(user.id)}
                            >
                              <UserX className='h-4 w-4 text-orange-600' />
                            </Button>
                          ) : (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleActivate(user.id)}
                            >
                              <UserCheck className='h-4 w-4 text-green-600' />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='flex items-center justify-between mt-6'>
              <p className='text-sm text-gray-600'>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
                of {pagination.total} users
              </p>

              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className='h-4 w-4 mr-1' />
                  Previous
                </Button>

                <div className='flex items-center gap-1'>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setPagination({ ...pagination, page })}
                      className='w-10'
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
