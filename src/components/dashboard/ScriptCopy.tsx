'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ScriptCopyProps {
  clientId: string;
}

export default function ScriptCopy({ clientId }: ScriptCopyProps) {
  const [copied, setCopied] = useState(false);

  const script = `<script
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/chatbot.js"
  data-client-id="${clientId}">
</script>`;

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className='spacing border-blue-200 bg-blue-50'>
      <CardHeader>
        <CardTitle className='text-blue-900'>Your Chatbot Script</CardTitle>
        <CardDescription className='text-blue-700'>
          Copy this script and paste it into your website's HTML (before closing
          &lt;/body&gt; tag)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='spacing bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto'>
          <pre>{script}</pre>
        </div>
        <Button onClick={copyScript} className='w-full spacing btn sm:w-auto'>
          {copied ? (
            <>
              <Check className='h-4 w-4 mr-2' />
              Copied!
            </>
          ) : (
            <div className='spacing flex '>
              <Copy className='h-4 w-4 mr-2 space-x-10' />
              Copy Script
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
