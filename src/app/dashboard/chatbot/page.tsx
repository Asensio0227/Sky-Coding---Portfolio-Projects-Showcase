'use client';

import { Button } from '@/components/ui/button';
import { Copy, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatbotConfig {
  welcomeMessage: string;
  tone: 'professional' | 'friendly' | 'casual';
  enabled: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
}

interface SettingsData {
  clientId: string;
  chatbotConfig: ChatbotConfig;
  businessInfo?: {
    name: string;
    domain: string;
    businessType: string;
  };
}

export default function ChatbotPage() {
  const [loading, setLoading] = useState(true);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/settings', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setSettingsData(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch chatbot config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  if (!settingsData || !settingsData.chatbotConfig) {
    return <p className='text-red-600'>No chatbot configuration found.</p>;
  }

  const { clientId, chatbotConfig } = settingsData;

  // Embed script snippet
  const scriptSnippet = `<script src="https://yourdomain.com/chatbot/widget.js" data-client-id="${clientId}"></script>`;

  return (
    <article className='section-center'>
      <div className='footer section  spacing max-w-3xl mx-auto space-y-6 p-4'>
        <h1 className='spacing text-2xl font-bold'>Chatbot Preview & Embed</h1>

        {/* Chatbot Preview Box */}
        <div className=' border rounded p-4 shadow-sm bg-white relative'>
          {chatbotConfig.enabled ? (
            <div
              style={{
                position: 'fixed',
                bottom:
                  chatbotConfig.position === 'bottom-right' ? 20 : undefined,
                right:
                  chatbotConfig.position === 'bottom-right' ? 20 : undefined,
                left: chatbotConfig.position === 'bottom-left' ? 20 : undefined,
                backgroundColor: chatbotConfig.primaryColor,
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                width: '250px',
              }}
            >
              <p>{chatbotConfig.welcomeMessage}</p>
              <small className='block mt-2 text-xs'>
                Tone: {chatbotConfig.tone}
              </small>
            </div>
          ) : (
            <p className='text-gray-500'>Chatbot is disabled</p>
          )}
        </div>

        {/* Embed Code Section */}
        <div className='spacing'>
          <label className='block font-medium'>Copy embed code:</label>
          <textarea
            readOnly
            value={scriptSnippet}
            className='w-full p-2 border rounded text-sm font-mono'
            rows={3}
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(scriptSnippet);
              setCopySuccess(true);
              setTimeout(() => setCopySuccess(false), 2000);
            }}
            className='btn flex items-center gap-2'
          >
            <Copy className='w-4 h-4' />
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
    </article>
  );
}
