// app/api/widget/config/route.ts
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import { NextRequest, NextResponse } from 'next/server';

interface ChatbotConfig {
  welcomeMessage: string;
  tone: 'professional' | 'friendly' | 'casual';
  enabled: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
}

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get('clientId');
    const originHeader = req.headers.get('x-widget-origin');

    if (!clientId || !originHeader) {
      return NextResponse.json(
        { success: false, message: 'Missing clientId or origin' },
        { status: 400 },
      );
    }

    await connectDB();

    const client = await Client.findById(clientId);

    if (!client || !client.isActive) {
      return NextResponse.json(
        { success: false, message: 'Client not found or inactive' },
        { status: 403 },
      );
    }

    // Normalize origin for security check
    const normalizedOrigin = originHeader
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];

    if (!client.allowedDomains.includes(normalizedOrigin)) {
      return NextResponse.json(
        { success: false, message: 'Domain not allowed' },
        { status: 403 },
      );
    }

    const chatbotConfig: ChatbotConfig = client.chatbotConfig;

    // Return config only if chatbot is enabled
    if (!chatbotConfig.enabled) {
      return NextResponse.json(
        { success: true, data: null, message: 'Chatbot is disabled' },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: true, data: chatbotConfig },
      { status: 200 },
    );
  } catch (err) {
    console.error('❌ Widget config fetch error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
