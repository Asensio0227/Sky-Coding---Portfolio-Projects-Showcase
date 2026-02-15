(function () {
  // Prevent loading twice
  if (window.__CHATBOT_WIDGET_LOADED__) return;
  window.__CHATBOT_WIDGET_LOADED__ = true;

  const script = document.currentScript;
  if (!script) return;

  const clientId = script.getAttribute('data-client-id');
  if (!clientId) {
    console.error('[Chatbot] Missing data-client-id');
    return;
  }

  // Detect base URL dynamically (prod, preview, localhost)
  const BASE_URL =
    script.src.split('/chatbot/widget.js')[0] ||
    'https://sky-coding-portfolio-projects-showc.vercel.app';

  const origin = window.location.origin;

  // Fetch config from your API (MongoDB-backed)
  fetch(`${BASE_URL}/api/widget/config?clientId=${clientId}`, {
    headers: {
      'X-Widget-Origin': origin,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(({ success, data }) => {
      if (!success || !data?.enabled) return;
      mountIframe(clientId, data);
    })
    .catch((err) => {
      console.warn('[Chatbot] Blocked:', err.message);
    });

  function mountIframe(clientId, config) {
    const iframe = document.createElement('iframe');

    iframe.src = `${BASE_URL}/chatbot?clientId=${clientId}`;

    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = config.position === 'bottom-left' ? 'auto' : '20px';
    iframe.style.left = config.position === 'bottom-left' ? '20px' : 'auto';
    iframe.style.width = '360px';
    iframe.style.height = '520px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.zIndex = '999999';
    iframe.style.background = 'transparent';

    document.body.appendChild(iframe);
  }
})();
