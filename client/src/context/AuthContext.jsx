import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('genugrin_admin_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('genugrin_admin_token');
      const storedAdmin = localStorage.getItem('genugrin_admin_user');

      if (storedToken && storedAdmin) {
        try {
          setAdmin(JSON.parse(storedAdmin));
          // Verify with backend
          const res = await authService.getMe();
          if (res.data?.success) {
            setAdmin(res.data.admin);
            localStorage.setItem('genugrin_admin_user', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.warn('[Auth]: Token validation failed or server offline. Keeping cached session.');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data?.success) {
        const { token, admin } = res.data;
        setToken(token);
        setAdmin(admin);
        localStorage.setItem('genugrin_admin_token', token);
        localStorage.setItem('genugrin_admin_user', JSON.stringify(admin));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password credentials.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('genugrin_admin_token');
    localStorage.removeItem('genugrin_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
