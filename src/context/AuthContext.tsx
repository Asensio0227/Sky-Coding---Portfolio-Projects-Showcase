// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SocialLinks } from '../../scripts/seed';

type User = {
  id: string;
  name?: string;
  email: string;
  role: 'admin' | 'user' | 'client';
  clientId?: string;
  bio?: string;
  socialLinks?: SocialLinks;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetch: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log('🔄 AuthContext: Fetching user...');
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const res = await fetch(`${base}/api/auth/me`, {
        credentials: 'include',
        cache: 'no-store',
      });

      console.log('📡 AuthContext: Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('✅ AuthContext: User data received:', data);

        if (data.success && data.user) {
          setUser(data.user);
          console.log('✅ AuthContext: User set:', data.user);
        } else {
          setUser(null);
          console.log('❌ AuthContext: No user in response');
        }
      } else {
        setUser(null);
        console.log('❌ AuthContext: Request failed with status:', res.status);
      }
    } catch (error) {
      console.error('❌ AuthContext: Fetch error:', error);
      setUser(null);
    } finally {
      setLoading(false);
      console.log('🏁 AuthContext: Loading complete');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
