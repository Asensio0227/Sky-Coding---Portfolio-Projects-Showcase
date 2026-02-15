'use client';

import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatbotData {
  clientId: string;
  name: string;
  domain: string;
  enabled: boolean;
  primaryColor: string;
  totalConversations: number;
  totalMessages: number;
}

export default function ChatbotListPage() {
  const [chatbot, setChatbot] = useState<ChatbotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChatbot = async () => {
      try {
        const res = await fetch('/api/settings', { credentials: 'include' });
        const data = await res.json();

        if (data.success) {
          setChatbot({
            clientId: data.data.clientId,
            name: data.data.businessInfo?.name || 'My Chatbot',
            domain: data.data.businessInfo?.domain || '',
            enabled: data.data.chatbotConfig?.enabled || false,
            primaryColor: data.data.chatbotConfig?.primaryColor || '#3B82F6',
            totalConversations: 0, // TODO: Fetch from stats API
            totalMessages: 0, // TODO: Fetch from stats API
          });
        } else {
          setError(data.message || 'Failed to load chatbot');
        }
      } catch (err) {
        console.error('Error fetching chatbot:', err);
        setError('Failed to load chatbot information');
      } finally {
        setLoading(false);
      }
    };

    fetchChatbot();
  }, []);

  const handleCopyClientId = (clientId: string) => {
    navigator.clipboard.writeText(clientId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleViewPreview = (clientId: string) => {
    router.push(`/admin/chatbot/${clientId}`);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='section footer p-4 border border-red-200 bg-red-50 rounded-lg'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className='section footer max-w-4xl mx-auto p-6'>
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>
            No Chatbot Found
          </h2>
          <p className='text-gray-600 mb-6'>
            Complete your business setup to activate your chatbot.
          </p>
          <Link href='/admin/settings'>
            <Button>
              <Settings className='w-4 h-4 mr-2' />
              Go to Settings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='footer section max-w-6xl mx-auto p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>My Chatbot</h1>
          <p className='text-gray-600 mt-1'>
            Manage your chatbot configuration and view analytics
          </p>
        </div>
        <Link href='/admin/settings'>
          <Button variant='outline'>
            <Settings className='w-4 h-4 mr-2' />
            Settings
          </Button>
        </Link>
      </div>

      {/* Status Card */}
      <div className='bg-white border rounded-lg p-6 shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div
              className='w-3 h-3 rounded-full'
              style={{
                backgroundColor: chatbot.enabled ? '#10b981' : '#ef4444',
              }}
            />
            <h2 className='text-xl font-semibold'>{chatbot.name}</h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              chatbot.enabled
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {chatbot.enabled ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className='space-y-3'>
          <div>
            <label className='text-sm font-medium text-gray-500'>Domain</label>
            <p className='text-gray-900'>
              {chatbot.domain || 'Not configured'}
            </p>
          </div>

          <div>
            <label className='text-sm font-medium text-gray-500'>
              Client ID
            </label>
            <div className='flex items-center gap-2 mt-1'>
              <code className='flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono'>
                {chatbot.clientId}
              </code>
              <Button
                size='sm'
                variant='outline'
                onClick={() => handleCopyClientId(chatbot.clientId)}
              >
                <Copy className='w-4 h-4' />
                {copySuccess ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-white border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: `${chatbot.primaryColor}20` }}
            >
              <span style={{ color: chatbot.primaryColor, fontSize: '20px' }}>
                💬
              </span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>
                {chatbot.totalConversations}
              </p>
              <p className='text-sm text-gray-600'>Total Conversations</p>
            </div>
          </div>
        </div>

        <div className='bg-white border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: `${chatbot.primaryColor}20` }}
            >
              <span style={{ color: chatbot.primaryColor, fontSize: '20px' }}>
                📨
              </span>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>
                {chatbot.totalMessages}
              </p>
              <p className='text-sm text-gray-600'>Total Messages</p>
            </div>
          </div>
        </div>

        <div className='bg-white border rounded-lg p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <div
              className='w-10 h-10 rounded-lg flex items-center justify-center'
              style={{ backgroundColor: `${chatbot.primaryColor}20` }}
            >
              <span style={{ color: chatbot.primaryColor, fontSize: '20px' }}>
                🎨
              </span>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <div
                  className='w-6 h-6 rounded border border-gray-300'
                  style={{ backgroundColor: chatbot.primaryColor }}
                />
                <p className='text-sm font-medium text-gray-900'>
                  {chatbot.primaryColor}
                </p>
              </div>
              <p className='text-sm text-gray-600'>Brand Color</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-white border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-3'>Preview Chatbot</h3>
          <p className='text-gray-600 text-sm mb-4'>
            See how your chatbot appears to visitors on your website
          </p>
          <Button
            onClick={() => handleViewPreview(chatbot.clientId)}
            className='w-full'
          >
            <ExternalLink className='w-4 h-4 mr-2' />
            View Preview
          </Button>
        </div>

        <div className='bg-white border rounded-lg p-6'>
          <h3 className='text-lg font-semibold mb-3'>Embed Code</h3>
          <p className='text-gray-600 text-sm mb-4'>
            Add this script to your website to enable the chatbot
          </p>
          <Link href='/admin/settings'>
            <Button variant='outline' className='w-full'>
              <Copy className='w-4 h-4 mr-2' />
              Get Embed Code
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold text-blue-900 mb-2'>
          Quick Actions
        </h3>
        <div className='flex flex-wrap gap-3'>
          <Link href='/admin/settings'>
            <Button size='sm' variant='outline'>
              Configure Settings
            </Button>
          </Link>
          <Link href='/admin/conversations'>
            <Button size='sm' variant='outline'>
              View Conversations
            </Button>
          </Link>
          <Link href={`/admin/chatbot/${chatbot.clientId}`}>
            <Button size='sm' variant='outline'>
              Test Chatbot
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
