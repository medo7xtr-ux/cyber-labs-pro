import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

const AppInitializer = ({ children }) => {
  const { theme } = useTheme();
  const { isLoading } = useLoading();
  const { user } = useAuth();

  useEffect(() => {
    // تهيئة إعدادات التطبيق
    console.log('App initialized with:', {
      theme,
      user: user ? 'Logged in' : 'Not logged in',
      isLoading
    });
  }, [theme, user, isLoading]);

  return <>{children}</>;
};

export default AppInitializer;