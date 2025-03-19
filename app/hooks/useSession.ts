import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'WORKER' | 'BUSINESS';
}

interface Session {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export default function useSession() {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // TODO: Implement actual session management with your backend
    // This is just mock data for now
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'WORKER',
    };

    setSession({
      user: mockUser,
      isLoading: false,
      error: null,
    });
  }, []);

  return session;
} 