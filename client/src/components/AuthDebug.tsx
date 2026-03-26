import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function AuthDebug() {
  const { user, token, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('🔐 Auth Debug Info:');
    console.log('User:', user);
    console.log('Token:', token ? `${token.substring(0, 50)}...` : 'null');
    console.log('Is Authenticated:', isAuthenticated);
    console.log('Is Loading:', isLoading);
    
    // Check localStorage directly
    const storedToken = localStorage.getItem('token');
    console.log('Stored Token in localStorage:', storedToken ? `${storedToken.substring(0, 50)}...` : 'null');
  }, [user, token, isAuthenticated, isLoading]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div>User: {user?.name || 'null'}</div>
      <div>Token: {token ? 'present' : 'null'}</div>
      <div>Auth: {isAuthenticated ? 'true' : 'false'}</div>
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
    </div>
  );
}
