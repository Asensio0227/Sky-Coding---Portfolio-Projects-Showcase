import { ClientId } from '../types/common';
import { IClient } from './Client';
import { IConversation } from './Conversation';
import { IMessage } from './Message';
import { IUser } from './User';

// Re-export all model interfaces
export type { IClient } from './Client';
export type { IConversation } from './Conversation';
export type { IMessage } from './Message';
export type { IUser } from './User';

// =====================
// AUTH TYPES
// =====================

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  domain: string;
  businessType?: 'hotel' | 'client' | 'cafe' | 'resort' | 'other';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  clientId?: string;
  role: 'client' | 'admin';
  email: string;
  isActive?: boolean; // make required
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled'; // add this
  iat?: number;
  exp?: number;
}

// =====================
// API RESPONSE TYPES
// =====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: 'client' | 'admin';
    clientId?: string;
    client?: {
      id: string;
      name: string;
      domain: string;
      clientId: string;
      plan: 'starter' | 'business' | 'pro';
    };
    redirectUrl: string;
  };
}

export interface MeResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    role: 'client' | 'admin';
    clientId?: string;
    client?: {
      id: string;
      name: string;
      domain: string;
      clientId: string;
      plan: 'starter' | 'business' | 'pro';
      isActive: boolean;
      chatbotConfig: {
        enabled: boolean;
        welcomeMessage: string;
        tone: string;
      };
    };
  };
}

// =====================
// CHAT TYPES
// =====================

export interface ChatMessage {
  clientId: ClientId; // new primary tenant identifier
  // some older clients might still send clientId; preserved in backend
  conversationId?: string;
  visitorId?: string;
  message: string;
  metadata?: {
    userAgent?: string;
    ip?: string;
    source?: string;
  };
}

export interface ChatResponse {
  success: boolean;
  data: {
    conversationId: string;
    message: {
      id: string;
      role: 'assistant';
      content: string;
      createdAt: Date;
    };
    aiMetadata?: {
      model: string;
      tokensUsed: number;
      responseTime: number;
    };
  };
}

// =====================
// DASHBOARD TYPES
// =====================

export interface ConversationWithMessages {
  conversation: IConversation;
  messages: IMessage[];
}

export interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  activeConversations: number;
  resolvedConversations: number;
  averageMessagesPerConversation: number;
  averageResponseTime?: number;
  topQuestions?: string[];
  conversationsBySource: {
    website: number;
    whatsapp: number;
    facebook: number;
    instagram: number;
    mobile: number;
  };
}

export interface ConversationListItem {
  id: string;
  visitorId: string;
  status: 'active' | 'resolved' | 'abandoned';
  messageCount: number;
  lastMessage: string;
  lastMessageAt: Date;
  createdAt: Date;
  source: string;
}

// =====================
// ADMIN TYPES
// =====================

export interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalConversations: number;
  totalMessages: number;
  activeClients: number;
  planDistribution: {
    free: number;
    basic: number;
    pro: number;
    enterprise: number;
  };
}

export interface ClientListItem {
  id: string;
  name: string;
  domain: string;
  owner: {
    id: string;
    email: string;
  };
  plan: string;
  isActive: boolean;
  totalConversations: number;
  totalMessages: number;
  createdAt: Date;
}

// =====================
// MIDDLEWARE TYPES
// =====================

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    clientId: string;
    role: 'client' | 'admin';
    email: string;
  };
}

// =====================
// VALIDATION TYPES
// =====================

export interface ValidationError {
  field: string;
  message: string;
}

export interface DomainValidationResult {
  isValid: boolean;
  normalizedDomain?: string;
  error?: string;
}
