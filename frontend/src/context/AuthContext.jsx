import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as authLogin, forgotPassword as authForgotPassword } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('brandsync_token');
      const storedUser = localStorage.getItem('brandsync_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('brandsync_token');
      localStorage.removeItem('brandsync_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authLogin(email, password);
    localStorage.setItem('brandsync_token', result.access_token);
    localStorage.setItem('brandsync_user', JSON.stringify(result.user));
    setToken(result.access_token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('brandsync_token');
    localStorage.removeItem('brandsync_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('brandsync_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const forgotPassword = useCallback(authForgotPassword, []);

  const isAuthenticated = Boolean(token && user);

  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        forgotPassword,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
