import { useState, useEffect } from 'react';
import { AuthState, Message } from '@/types';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await chrome.runtime.sendMessage<Message>({ type: 'AUTH_CHECK' });
      setAuthState(response.authState);
    } catch (error) {
      console.error('Auth check error:', error);
      setAuthState(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      const response = await chrome.runtime.sendMessage<Message>({ type: 'AUTH_LOGIN' });

      if (response.success && response.authState) {
        setAuthState(response.authState);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await chrome.runtime.sendMessage<Message>({ type: 'AUTH_LOGOUT' });
      setAuthState(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    authState,
    loading,
    isAuthenticated: authState?.isAuthenticated ?? false,
    login,
    logout,
    checkAuth,
  };
}
