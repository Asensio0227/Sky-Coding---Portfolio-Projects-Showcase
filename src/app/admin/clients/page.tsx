// src/app/admin/clients/page.tsx
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
  Building2,
  Edit,
  Eye,
  Filter,
  Loader2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Client {
  id: string;
  name: string;
  domain: string;
  businessType: string;
  owner: {
    id: string;
    email: string;
    isActive: boolean;
  } | null;
  plan: string;
  isActive: boolean;
  chatbotEnabled: boolean;
  stats: {
    totalConversations: number;
    totalMessages: number;
    activeConversations: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    fetchClients();
  }, [statusFilter, planFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (planFilter !== 'all') params.append('plan', planFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/clients?${params}`, {
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setClients(data.data.clients);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.domain.toLowerCase().includes(search.toLowerCase()) ||
      client.owner?.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='section-center spacing'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Clients</h1>
          <p className='text-gray-600 mt-1'>Manage all client accounts</p>
        </div>
        <Button className='bg-gradient-to-r from-blue-600 to-purple-600'>
          <Plus className='h-4 w-4 mr-2' />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <Card className='spacing'>
        <CardHeader>
          <CardTitle className='text-lg flex items-center'>
            <Filter className='h-5 w-5 mr-2' />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='Search clients...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-10'
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Plan Filter */}
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder='Plan' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Plans</SelectItem>
                <SelectItem value='starter'>Starter</SelectItem>
                <SelectItem value='business'>Business</SelectItem>
                <SelectItem value='pro'>Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className='spacing'>
        <CardHeader>
          <CardTitle>
            {filteredClients.length} Client
            {filteredClients.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className='text-center py-12'>
              <Building2 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <p className='text-gray-600'>No clients found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left p-4 font-semibold'>Client</th>
                    <th className='text-left p-4 font-semibold'>Owner</th>
                    <th className='text-left p-4 font-semibold'>Plan</th>
                    <th className='text-left p-4 font-semibold'>Status</th>
                    <th className='text-left p-4 font-semibold'>Stats</th>
                    <th className='text-right p-4 font-semibold'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className='border-b hover:bg-gray-50'>
                      <td className='p-4'>
                        <div>
                          <p className='font-medium'>{client.name}</p>
                          <p className='text-sm text-gray-500'>
                            {client.domain}
                          </p>
                        </div>
                      </td>
                      <td className='p-4'>
                        <p className='text-sm'>
                          {client.owner?.email || 'N/A'}
                        </p>
                      </td>
                      <td className='p-4'>
                        <Badge variant='secondary' className='capitalize'>
                          {client.plan}
                        </Badge>
                      </td>
                      <td className='p-4'>
                        <Badge
                          variant={client.isActive ? 'default' : 'secondary'}
                        >
                          {client.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className='p-4'>
                        <div className='text-sm'>
                          <p>{client.stats.totalConversations} chats</p>
                          <p className='text-gray-500'>
                            {client.stats.totalMessages} messages
                          </p>
                        </div>
                      </td>
                      <td className='p-4'>
                        <div className='flex items-center justify-end gap-2'>
                          <Link href={`/admin/clients/${client.id}`}>
                            <Button variant='ghost' size='sm'>
                              <Eye className='h-4 w-4' />
                            </Button>
                          </Link>
                          <Button variant='ghost' size='sm'>
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
