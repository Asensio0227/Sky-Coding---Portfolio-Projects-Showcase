'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatbotConfig {
  welcomeMessage: string;
  tone: 'professional' | 'friendly' | 'casual';
  enabled: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
}

interface ChatbotPageProps {
  params: { clientId: string };
}

export default function ChatbotPage({ params }: ChatbotPageProps) {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/widget/config?clientId=${params.clientId}`,
          {
            headers: {
              'X-Widget-Origin': window.location.origin,
            },
          },
        );
        const data = await res.json();

        if (data.success) {
          setConfig(data.data);
        } else {
          setError(data.message || 'Failed to load chatbot configuration');
        }
      } catch (err) {
        console.error('Error fetching chatbot config:', err);
        setError('Failed to load chatbot configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [params.clientId]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 border border-red-200 bg-red-50 rounded-lg'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className='p-4 border border-yellow-200 bg-yellow-50 rounded-lg'>
        <p className='text-yellow-700'>No chatbot configuration found</p>
      </div>
    );
  }

  if (!config.enabled) {
    return (
      <div className='p-4 border border-gray-200 bg-gray-50 rounded-lg'>
        <p className='text-gray-600'>Chatbot is currently disabled</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-2'>Chatbot Preview</h1>
        <p className='text-gray-600'>
          Client ID:{' '}
          <code className='bg-gray-100 px-2 py-1 rounded text-sm'>
            {params.clientId}
          </code>
        </p>
      </div>

      {/* Preview Container */}
      <div className='border rounded-lg p-8 bg-gray-50 min-h-[400px] relative'>
        <p className='text-sm text-gray-500 mb-4'>
          Preview of how the chatbot will appear on your website:
        </p>

        {/* Chatbot Widget Preview */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: config.position === 'bottom-right' ? '20px' : 'auto',
            left: config.position === 'bottom-left' ? '20px' : 'auto',
            backgroundColor: config.primaryColor,
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            width: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <p className='font-medium mb-2'>{config.welcomeMessage}</p>
          <small className='text-xs opacity-90'>Tone: {config.tone}</small>
        </div>
      </div>

      {/* Configuration Details */}
      <div className='border rounded-lg p-6 bg-white'>
        <h2 className='text-lg font-semibold mb-4'>Current Configuration</h2>
        <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <dt className='text-sm font-medium text-gray-500'>
              Welcome Message
            </dt>
            <dd className='mt-1 text-sm text-gray-900'>
              {config.welcomeMessage}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500'>Tone</dt>
            <dd className='mt-1 text-sm text-gray-900 capitalize'>
              {config.tone}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500'>Primary Color</dt>
            <dd className='mt-1 flex items-center gap-2'>
              <span
                className='inline-block w-6 h-6 rounded border border-gray-300'
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className='text-sm text-gray-900'>
                {config.primaryColor}
              </span>
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500'>Position</dt>
            <dd className='mt-1 text-sm text-gray-900 capitalize'>
              {config.position.replace('-', ' ')}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
