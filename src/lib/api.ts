/**
 * API Client Utilities
 * Centralized API calls with error handling and authentication
 */

// ==================== TYPE DEFINITIONS ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SignupData {
  email: string;
  password: string;
  businessName: string;
  domain: string;
  businessType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'client';
  clientId?: string;
}

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  media: Array<{
    url: string;
    type: 'image' | 'video';
    publicId: string;
  }>;
  category?: string[];
  featured?: boolean;
  techStack?: Record<string, string[]>;
}

export interface ChatMessageData {
  clientId: string;
  conversationId?: string;
  message: string;
  visitorId?: string;
}

export interface ConversationData {
  id: string;
  clientId: string;
  visitorId: string;
  status: 'active' | 'resolved' | 'abandoned';
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
}

export interface MessageData {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  activeConversations: number;
  responseRate: number;
  topQuestions: string[];
}

// ==================== BASE CONFIG ====================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// ==================== API CLIENT ====================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Include cookies for auth
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T, B = unknown>(
    endpoint: string,
    body?: B,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T, B = unknown>(
    endpoint: string,
    body?: B,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file (multipart/form-data)
  async upload<T>(
    endpoint: string,
    formData: FormData,
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        // Don't set Content-Type header for FormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error(`Upload Error [${endpoint}]:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const api = new ApiClient();

// ==================== AUTH API ====================

export const authApi = {
  signup: (data: SignupData) => {
    return api.post<UserData, SignupData>('/api/auth/signup', data);
  },

  login: (data: LoginData) => {
    return api.post<UserData, LoginData>('/api/auth/login', data);
  },

  logout: () => {
    return api.post<void>('/api/auth/logout');
  },

  getCurrentUser: () => {
    return api.get<{ user: UserData }>('/api/auth/me');
  },
};

// ==================== PROJECTS API ====================

export const projectsApi = {
  getAll: () => {
    return api.get<ProjectData[]>('/api/projects');
  },

  getById: (id: string) => {
    return api.get<ProjectData>(`/api/projects/${id}`);
  },

  create: (projectData: ProjectData) => {
    return api.post<ProjectData, ProjectData>('/api/projects', projectData);
  },

  update: (id: string, projectData: Partial<ProjectData>) => {
    return api.put<ProjectData, Partial<ProjectData>>(
      `/api/projects/${id}`,
      projectData,
    );
  },

  delete: (id: string) => {
    return api.delete<void>(`/api/projects/${id}`);
  },

  getFeatured: () => {
    return api.get<ProjectData[]>('/api/projects?featured=true');
  },

  getByCategory: (category: string) => {
    return api.get<ProjectData[]>(`/api/projects?category=${category}`);
  },
};

// ==================== CHAT API ====================

export const chatApi = {
  sendMessage: (data: ChatMessageData) => {
    return api.post<MessageData, ChatMessageData>('/api/chat/message', data);
  },

  getConversation: (conversationId: string) => {
    return api.get<ConversationData>(
      `/api/chat/conversations/${conversationId}`,
    );
  },
};

// ==================== ADMIN API ====================

export const adminApi = {
  getConversations: (clientId?: string) => {
    const query = clientId ? `?clientId=${clientId}` : '';
    return api.get<ConversationData[]>(`/api/admin/conversations${query}`);
  },

  getMessages: (conversationId: string) => {
    return api.get<MessageData[]>(`/api/admin/messages/${conversationId}`);
  },

  getDashboardStats: (clientId?: string) => {
    const query = clientId ? `?clientId=${clientId}` : '';
    return api.get<DashboardStats>(`/api/admin/stats${query}`);
  },
};

// ==================== UPLOAD API ====================

interface UploadResponse {
  url: string;
  publicId: string;
  type: 'image' | 'video';
}

export const uploadApi = {
  uploadMedia: (file: File, mediaType: 'image' | 'video' = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mediaType', mediaType);
    return api.upload<UploadResponse>('/api/upload', formData);
  },

  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return api.upload<UploadResponse[]>('/api/upload/multiple', formData);
  },
};

// ==================== PROFILE API ====================

interface ProfileData {
  id: string;
  name: string;
  bio: string;
  email: string;
  avatar?: string;
  socialLinks?: Record<string, string>;
}

export const profileApi = {
  get: () => {
    return api.get<ProfileData>('/api/profile');
  },

  update: (profileData: Partial<ProfileData>) => {
    return api.put<ProfileData, Partial<ProfileData>>(
      '/api/profile',
      profileData,
    );
  },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Handle API errors consistently
 */
export function handleApiError(response: ApiResponse<unknown>): string | null {
  if (!response.success) {
    console.error('API Error:', response.message);
    return response.message || 'An error occurred';
  }
  return null;
}

/**
 * Check if response is successful
 */
export function isApiSuccess(response: ApiResponse<unknown>): boolean {
  return response.success === true;
}

/**
 * Extract data from successful response
 */
export function getApiData<T>(response: ApiResponse<T>): T | null {
  return response.success ? response.data || null : null;
}

// ==================== EXPORTS ====================

export default api;
