import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { enqueueSnackbar } from 'notistack';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  // تحميل حالة المستخدم عند بدء التشغيل
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsPremium(parsedUser.isPremium || false);
      } catch (error) {
        console.error('Error parsing user data:', error);
        clearAuthData();
      }
    }
    
    setLoading(false);
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedEmail');
  };

  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      
      // TODO: استبدل هذا بالاتصال الحقيقي بالـ API
      // محاكاة تسجيل الدخول للاختبار
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // بيانات اختبارية
      const userData = {
        id: 1,
        email,
        name: email.split('@')[0],
        role: 'user',
        isPremium: false,
        avatar: null,
        createdAt: new Date().toISOString(),
      };
      
      const tokens = {
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
      };
      
      // حفظ البيانات
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsPremium(userData.isPremium);
      
      enqueueSnackbar('تم تسجيل الدخول بنجاح', { 
        variant: 'success',
        autoHideDuration: 2000
      });
      
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('Login error:', error);
      enqueueSnackbar('فشل تسجيل الدخول. تحقق من بياناتك.', { 
        variant: 'error',
        autoHideDuration: 3000
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'حدث خطأ في تسجيل الدخول' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
    setIsPremium(false);
    
    enqueueSnackbar('تم تسجيل الخروج بنجاح', { 
      variant: 'info',
      autoHideDuration: 2000
    });
    
    // إعادة التوجيه
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const getRememberedEmail = useCallback(() => {
    return localStorage.getItem('rememberedEmail');
  }, []);

  const value = {
    user,
    isAuthenticated,
    isPremium,
    loading,
    login,
    logout,
    getRememberedEmail,
    clearAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};