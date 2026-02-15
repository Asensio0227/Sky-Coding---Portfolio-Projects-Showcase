// src/app/admin/clients/[id]/edit/page.tsx
'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ClientData {
  id: string;
  name: string;
  domain: string;
  allowedDomains: string[];
  businessType: string;
  description: string;
  plan: string;
  isActive: boolean;
  chatbotConfig: {
    welcomeMessage: string;
    tone: 'professional' | 'friendly' | 'casual';
    enabled: boolean;
    primaryColor: string;
    position: 'bottom-right' | 'bottom-left';
  };
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<ClientData>({
    id: '',
    name: '',
    domain: '',
    allowedDomains: [],
    businessType: 'other',
    description: '',
    plan: 'free',
    isActive: true,
    chatbotConfig: {
      welcomeMessage: 'Hello! How can I help you today?',
      tone: 'friendly',
      enabled: true,
      primaryColor: '#3B82F6',
      position: 'bottom-right',
    },
  });

  const [allowedDomainsInput, setAllowedDomainsInput] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setFormData({
          id: data.data.id,
          name: data.data.name,
          domain: data.data.domain,
          allowedDomains: data.data.allowedDomains || [],
          businessType: data.data.businessType || 'other',
          description: data.data.description || '',
          plan: data.data.plan,
          isActive: data.data.isActive,
          chatbotConfig: data.data.chatbotConfig,
        });
        setAllowedDomainsInput(data.data.allowedDomains.join(', '));
      } else {
        setError('Failed to load client data');
      }
    } catch (err) {
      console.error('Failed to fetch client:', err);
      setError('Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Parse allowed domains
      const allowedDomains = allowedDomainsInput
        .split(',')
        .map((d) => d.trim())
        .filter((d) => d.length > 0);

      const updateData = {
        name: formData.name,
        domain: formData.domain,
        allowedDomains,
        businessType: formData.businessType,
        description: formData.description,
        plan: formData.plan,
        isActive: formData.isActive,
        chatbotConfig: formData.chatbotConfig,
      };

      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Client updated successfully!');
        setTimeout(() => {
          router.push(`/admin/clients/${clientId}`);
        }, 1500);
      } else {
        setError(data.message || 'Failed to update client');
      }
    } catch (err) {
      console.error('Failed to update client:', err);
      setError('An error occurred while updating the client');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='section-center spacing max-w-4xl mx-auto'>
      {/* Header */}
      <div className='spacing flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href={`/admin/clients/${clientId}`}>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Edit Client</h1>
            <p className='text-gray-600 mt-1'>{formData.name}</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className='border-green-200 bg-green-50'>
          <AlertCircle className='h-4 w-4 text-green-600' />
          <AlertDescription className='text-green-700'>
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Basic Information */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update client details and domain settings
            </CardDescription>
          </CardHeader>
          <CardContent className='spacing'>
            {/* Client Name */}
            <div className='space-y-12'>
              <Label htmlFor='name'>Client Name *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='My Client'
                required
              />
            </div>

            {/* Domain */}
            <div className='space-y-12'>
              <Label htmlFor='domain'>Primary Domain *</Label>
              <Input
                id='domain'
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
                placeholder='example.com'
                required
              />
              <p className='text-xs text-gray-500'>
                Format: example.com (no http, www, or paths)
              </p>
            </div>

            {/* Allowed Domains */}
            <div className='space-y-12'>
              <Label htmlFor='allowedDomains'>Allowed Domains</Label>
              <Input
                id='allowedDomains'
                value={allowedDomainsInput}
                onChange={(e) => setAllowedDomainsInput(e.target.value)}
                placeholder='example.com, www.example.com'
              />
              <p className='text-xs text-gray-500'>
                Comma-separated list of domains that can use the chatbot
              </p>
            </div>

            {/* Business Type */}
            <div className='space-y-12'>
              <Label htmlFor='businessType'>Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='hotel'>Hotel</SelectItem>
                  <SelectItem value='client'>Client</SelectItem>
                  <SelectItem value='cafe'>Cafe</SelectItem>
                  <SelectItem value='resort'>Resort</SelectItem>
                  <SelectItem value='other'>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className='space-y-12'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Brief description of the business...'
                rows={3}
                maxLength={500}
              />
              <p className='text-xs text-gray-500'>
                {formData.description.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plan & Status */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle>Plan & Status</CardTitle>
            <CardDescription>
              Manage subscription plan and account status
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Plan */}
            <div className='space-y-2'>
              <Label htmlFor='plan'>Subscription Plan</Label>
              <Select
                value={formData.plan}
                onValueChange={(value: 'starter' | 'business' | 'pro') =>
                  setFormData({ ...formData, plan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='starter'>Starter</SelectItem>
                  <SelectItem value='business'>Business</SelectItem>
                  <SelectItem value='pro'>Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Status */}
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='isActive'>Active Status</Label>
                <p className='text-sm text-gray-500'>
                  Enable or disable this client account
                </p>
              </div>
              <Switch
                id='isActive'
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Chatbot Configuration */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle>Chatbot Configuration</CardTitle>
            <CardDescription>
              Customize chatbot appearance and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Chatbot Enabled */}
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='chatbotEnabled'>Enable Chatbot</Label>
                <p className='text-sm text-gray-500'>
                  Turn the chatbot on or off
                </p>
              </div>
              <Switch
                id='chatbotEnabled'
                checked={formData.chatbotConfig.enabled}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    chatbotConfig: {
                      ...formData.chatbotConfig,
                      enabled: checked,
                    },
                  })
                }
              />
            </div>

            {/* Welcome Message */}
            <div className='space-y-2'>
              <Label htmlFor='welcomeMessage'>Welcome Message</Label>
              <Textarea
                id='welcomeMessage'
                value={formData.chatbotConfig.welcomeMessage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    chatbotConfig: {
                      ...formData.chatbotConfig,
                      welcomeMessage: e.target.value,
                    },
                  })
                }
                placeholder='Hello! How can I help you today?'
                rows={2}
                maxLength={200}
              />
              <p className='text-xs text-gray-500'>
                {formData.chatbotConfig.welcomeMessage.length}/200 characters
              </p>
            </div>

            {/* Tone */}
            <div className='space-y-2'>
              <Label htmlFor='tone'>Conversation Tone</Label>
              <Select
                value={formData.chatbotConfig.tone}
                onValueChange={(
                  value: 'professional' | 'friendly' | 'casual',
                ) =>
                  setFormData({
                    ...formData,
                    chatbotConfig: { ...formData.chatbotConfig, tone: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='professional'>Professional</SelectItem>
                  <SelectItem value='friendly'>Friendly</SelectItem>
                  <SelectItem value='casual'>Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div className='space-y-2'>
              <Label htmlFor='position'>Chatbot Position</Label>
              <Select
                value={formData.chatbotConfig.position}
                onValueChange={(value: 'bottom-right' | 'bottom-left') =>
                  setFormData({
                    ...formData,
                    chatbotConfig: {
                      ...formData.chatbotConfig,
                      position: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='bottom-right'>Bottom Right</SelectItem>
                  <SelectItem value='bottom-left'>Bottom Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Primary Color */}
            <div className='space-y-2'>
              <Label htmlFor='primaryColor'>Primary Color</Label>
              <div className='flex gap-3'>
                <Input
                  id='primaryColor'
                  type='color'
                  value={formData.chatbotConfig.primaryColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chatbotConfig: {
                        ...formData.chatbotConfig,
                        primaryColor: e.target.value,
                      },
                    })
                  }
                  className='w-20 h-10'
                />
                <Input
                  type='text'
                  value={formData.chatbotConfig.primaryColor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chatbotConfig: {
                        ...formData.chatbotConfig,
                        primaryColor: e.target.value,
                      },
                    })
                  }
                  placeholder='#3B82F6'
                  pattern='^#[0-9A-Fa-f]{6}$'
                />
              </div>
              <p className='text-xs text-gray-500'>
                Enter a valid hex color (e.g., #3B82F6)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex items-center justify-end gap-3'>
          <Link href={`/admin/clients/${clientId}`}>
            <Button className='btn' type='button' variant='outline'>
              Cancel
            </Button>
          </Link>
          <Button
            type='submit'
            disabled={saving}
            className='btn bg-gradient-to-r from-blue-600 to-purple-600'
          >
            {saving ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='h-4 w-4 mr-2' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
