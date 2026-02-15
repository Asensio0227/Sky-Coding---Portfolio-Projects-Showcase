'use client';

// this page relies entirely on client-side interactivity; prevent static prerendering
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

interface ChatbotConfig {
  welcomeMessage: string;
  tone: 'professional' | 'friendly' | 'casual';
  enabled: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
}

/**
 * This component is loaded in an iframe on the customer's website
 * via the widget script: <script src="/chatbot/widget.js" data-client-id="..."></script>
 */
export default function ChatbotIframe() {
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Move everything into async function to avoid sync setState warnings
    const loadConfig = async () => {
      try {
        // Read URL params directly - no need for separate state
        const params = new URLSearchParams(window.location.search);
        const clientId = params.get('clientId');

        // Early return if no clientId
        if (!clientId) {
          console.warn('No clientId provided in URL');
          setLoading(false);
          return;
        }

        // Get the parent window's origin for security validation
        const parentOrigin = document.referrer
          ? new URL(document.referrer).origin
          : window.location.origin;

        // Fetch config
        const res = await fetch(`/api/widget/config?clientId=${clientId}`, {
          headers: {
            'X-Widget-Origin': parentOrigin,
          },
        });

        const data = await res.json();

        if (data.success && data.data) {
          setConfig(data.data);
        } else {
          console.error('Failed to load config:', data.message);
        }
      } catch (err) {
        console.error('Failed to load chatbot config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []); // Empty dependency array - only run once on mount

  // Don't render while loading
  if (loading) {
    return null;
  }

  // Don't render if no config
  if (!config) {
    return null;
  }

  // Don't render if disabled
  if (!config.enabled) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: config.position === 'bottom-right' ? '20px' : 'auto',
        left: config.position === 'bottom-left' ? '20px' : 'auto',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Chatbot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: config.primaryColor,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label='Open chat'
        >
          💬
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          style={{
            width: '350px',
            height: '500px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: config.primaryColor,
              color: '#fff',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Chat with us
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '24px',
                height: '24px',
              }}
              aria-label='Close chat'
            >
              ✕
            </button>
          </div>

          {/* Welcome Message */}
          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            <div
              style={{
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                {config.welcomeMessage}
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
              Tone:{' '}
              <span style={{ textTransform: 'capitalize' }}>{config.tone}</span>
            </p>
          </div>

          {/* Input Area (Placeholder) */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type='text'
              placeholder='Type your message...'
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
              }}
              disabled
            />
            <button
              style={{
                padding: '8px 16px',
                backgroundColor: config.primaryColor,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                opacity: 0.6,
              }}
              disabled
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
