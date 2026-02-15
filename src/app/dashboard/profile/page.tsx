'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertCircle,
  Building2,
  Calendar,
  Edit,
  Globe,
  Loader2,
  Mail,
  Save,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    domain: string;
    businessType: string;
    description: string;
    plan: string;
    isActive: boolean;
    chatbotConfig: {
      welcomeMessage: string;
      tone: string;
      enabled: boolean;
      primaryColor: string;
      position: string;
    };
  } | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    businessType: 'other',
    description: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        if (data.user.client) {
          setFormData({
            name: data.user.client.name,
            domain: data.user.client.domain,
            businessType: data.user.client.businessType || 'other',
            description: data.user.client.description || '',
          });
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/profile/client', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        setEditing(false);
        fetchProfile();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Failed to load profile</div>;
  }

  return (
    <article className='section-center footer'>
      <div className='spacing section max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='spacing'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Profile & Client
            </h1>
            <p className='text-gray-600 mt-1'>
              Manage your account and client information
            </p>
          </div>
          {!editing && profile.client && (
            <Button
              onClick={() => setEditing(true)}
              variant='outline'
              className='btn'
            >
              <Edit className='h-4 w-4 mr-2' />
              Edit Client
            </Button>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className='border-green-200 bg-green-50'>
            <AlertCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-700'>
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Account Information */}
        <Card className='spacing'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <User className='h-5 w-5 mr-2' />
              Account Information
            </CardTitle>
            <CardDescription>Your account details and status</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <p className='text-sm font-medium text-gray-500 flex items-center'>
                  <Mail className='h-4 w-4 mr-2' />
                  Email
                </p>
                <p className='text-gray-900'>{profile.email}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Role</p>
                <Badge variant='secondary' className='capitalize'>
                  {profile.role}
                </Badge>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500'>Status</p>
                <Badge variant={profile.isActive ? 'default' : 'secondary'}>
                  {profile.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-500 flex items-center'>
                  <Calendar className='h-4 w-4 mr-2' />
                  Member Since
                </p>
                {profile.createdAt && (
                  <p className='text-gray-900'>
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        {profile.client ? (
          <Card className='spacing'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Building2 className='h-5 w-5 mr-2' />
                Client Information
              </CardTitle>
              <CardDescription>
                {editing
                  ? 'Update your client details'
                  : 'Your client details'}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {editing ? (
                <>
                  {/* Edit Mode */}
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Client Name *</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder='My Client'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='domain'>Website Domain *</Label>
                    <Input
                      id='domain'
                      value={formData.domain}
                      onChange={(e) =>
                        setFormData({ ...formData, domain: e.target.value })
                      }
                      placeholder='example.com'
                    />
                    <p className='text-xs text-gray-500'>
                      Format: example.com (no http, www, or paths)
                    </p>
                  </div>

                  <div className='space-y-2'>
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

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Description</Label>
                    <Textarea
                      id='description'
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder='Brief description of your business...'
                      rows={3}
                      maxLength={500}
                    />
                    <p className='text-xs text-gray-500'>
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div className='flex items-center gap-3 pt-4'>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className='btn'
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
                    <Button
                      variant='outline'
                      onClick={() => setEditing(false)}
                      disabled={saving}
                      className='btn'
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div className='spacing grid gap-4 md:grid-cols-2'>
                    <div>
                      <p className='text-sm font-medium text-gray-500 flex items-center'>
                        <Building2 className='h-4 w-4 mr-2' />
                        Client Name
                      </p>
                      <p className='text-gray-900'>{profile.client.name}</p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500 flex items-center'>
                        <Globe className='h-4 w-4 mr-2' />
                        Domain
                      </p>
                      <p className='text-gray-900'>
                        {profile.client.domain}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>
                        Business Type
                      </p>
                      <p className='text-gray-900 capitalize'>
                        {profile.client.businessType || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Plan</p>
                      <Badge variant='secondary' className='capitalize'>
                        {profile.client.plan}
                      </Badge>
                    </div>
                  </div>

                  {profile.client.description && (
                    <div>
                      <p className='text-sm font-medium text-gray-500'>
                        Description
                      </p>
                      <p className='text-gray-900'>
                        {profile.client.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Chatbot Status
                    </p>
                    <Badge
                      variant={
                        profile.client.chatbotConfig.enabled
                          ? 'default'
                          : 'secondary'
                      }
                      className='spacing'
                    >
                      {profile.client.chatbotConfig.enabled
                        ? 'Enabled'
                        : 'Disabled'}
                    </Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          /* No Client - Create One */
          <Card className='spacing border-dashed border-2'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Building2 className='h-5 w-5 mr-2' />
                No Client Configured
              </CardTitle>
              <CardDescription>
                You don't have a client set up yet. Contact support to
                create one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  A client account is required to use the chatbot features.
                  Please contact our support team to get started.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </article>
  );
}
