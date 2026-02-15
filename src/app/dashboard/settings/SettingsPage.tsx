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
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatbotConfig {
  welcomeMessage: string;
  tone: 'professional' | 'friendly' | 'casual';
  enabled: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<ChatbotConfig>({
    welcomeMessage: 'Hello! How can I help you today?',
    tone: 'friendly',
    enabled: true,
    primaryColor: '#3B82F6',
    position: 'bottom-right',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', { credentials: 'include' });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Failed to load settings');
        return;
      }

      if (data.data?.chatbotConfig) {
        setSettings({
          welcomeMessage:
            data.data.chatbotConfig.welcomeMessage ||
            'Hello! How can I help you today?',
          tone: data.data.chatbotConfig.tone || 'friendly',
          enabled: data.data.chatbotConfig.enabled ?? true,
          primaryColor: data.data.chatbotConfig.primaryColor || '#3B82F6',
          position: data.data.chatbotConfig.position || 'bottom-right',
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatbotConfig: settings }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to save settings');
        return;
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('An error occurred while saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <article className='section-center'>
      <div className='spacing section footer max-w-2xl'>
        <div className='spacing'>
          <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
          <p className='text-gray-600 mt-1'>
            Customize your chatbot appearance and behavior
          </p>
        </div>

        {error && (
          <Alert className='border-red-200 bg-red-50'>
            <AlertDescription className='text-red-700 font-medium'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className='border-green-200 bg-green-50'>
            <AlertDescription className='text-green-700 font-medium'>
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Card className='spacing'>
          <CardHeader>
            <CardTitle>Chatbot Configuration</CardTitle>
            <CardDescription>
              Configure how your chatbot appears and responds to visitors
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Enable/Disable */}
            <div className='flex items-center justify-between'>
              <div>
                <Label htmlFor='enabled'>Enable Chatbot</Label>
                <p className='text-sm text-gray-500'>
                  Turn your chatbot on or off
                </p>
              </div>
              <Switch
                id='enabled'
                checked={settings.enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enabled: checked })
                }
              />
            </div>

            {/* Welcome Message */}
            <div className='space-y-2'>
              <Label htmlFor='welcomeMessage'>Welcome Message</Label>
              <Textarea
                id='welcomeMessage'
                value={settings.welcomeMessage}
                onChange={(e) =>
                  setSettings({ ...settings, welcomeMessage: e.target.value })
                }
                placeholder='Enter welcome message...'
                rows={3}
                maxLength={200}
              />
              <p className='text-xs text-gray-500'>
                {settings.welcomeMessage.length}/200 characters
              </p>
            </div>

            {/* Tone */}
            <div className='space-y-2'>
              <Label htmlFor='tone'>Conversation Tone</Label>
              <Select
                value={settings.tone}
                onValueChange={(
                  value: 'professional' | 'friendly' | 'casual',
                ) => setSettings({ ...settings, tone: value })}
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
                value={settings.position}
                onValueChange={(value: 'bottom-right' | 'bottom-left') =>
                  setSettings({ ...settings, position: value })
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
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className='w-20 h-10'
                />
                <Input
                  type='text'
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  placeholder='#3B82F6'
                  pattern='^#[0-9A-Fa-f]{6}$'
                />
              </div>
              <p className='text-xs text-gray-500'>
                Enter a valid hex color (e.g., #3B82F6)
              </p>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={saving} className='w-full'>
              {saving ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='h-4 w-4 mr-2' />
                  Save Settings
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
