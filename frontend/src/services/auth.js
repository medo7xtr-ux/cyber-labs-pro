import api from './api';
import { ENDPOINTS } from '../config/api';

/**
 * خدمة المصادقة المتكاملة مع AuthContext
 * تدعم JWT Tokens مع Refresh Tokens
 */

export const login = async (email, password, rememberMe = false) => {
  try {
    // إرسال بيانات تسجيل الدخول إلى API
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
      remember_me: rememberMe
    });

    if (response.data.success && response.data.tokens) {
      const { access_token, refresh_token } = response.data.tokens;
      const user = response.data.user;

      // حفظ التوكنات وبيانات المستخدم
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));

      // حفظ البريد الإلكتروني إذا طلب التذكر
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      }

      return {
        success: true,
        access_token,
        refresh_token,
        user
      };
    }

    throw new Error(response.data.message || 'فشل تسجيل الدخول');

  } catch (error) {
    console.error('Login error:', error);
    
    // معالجة أخطاء محددة
    let errorMessage = 'فشل تسجيل الدخول';
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      } else if (error.response.status === 423) {
        errorMessage = 'الحساب مقفل مؤقتاً. حاول لاحقاً';
      } else if (error.response.status === 403) {
        errorMessage = 'الحساب غير مفعل. يرجى تفعيل حسابك';
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error
    };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);

    if (response.data.success) {
      // إذا كان التسجيل يتضمن تسجيل دخول تلقائي
      if (response.data.tokens) {
        const { access_token, refresh_token } = response.data.tokens;
        const user = response.data.user;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return {
        success: true,
        message: response.data.message || 'تم إنشاء الحساب بنجاح',
        user: response.data.user,
        requires_verification: response.data.requires_verification || false
      };
    }

    throw new Error(response.data.message || 'فشل إنشاء الحساب');

  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'فشل إنشاء الحساب';
    const errors = {};

    if (error.response?.data?.errors) {
      errorMessage = 'يوجد أخطاء في البيانات المدخلة';
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        errors[field] = Array.isArray(messages) ? messages[0] : messages;
      });
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage,
      errors,
      error
    };
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // إرسال طلب تسجيل الخروج إلى الخادم
      await api.post(ENDPOINTS.AUTH.LOGOUT, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    // حتى إذا فشل الطلب، نقوم بتنظيف التخزين المحلي
  } finally {
    // تنظيف التخزين المحلي
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('remembered_email');
    
    return { success: true };
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    });

    if (response.data.success && response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }

      return {
        success: true,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token
      };
    }

    throw new Error('فشل تجديد التوكن');

  } catch (error) {
    console.error('Refresh token error:', error);
    return {
      success: false,
      message: 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى'
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return {
        success: false,
        message: 'لا يوجد توكن نشط'
      };
    }

    const response = await api.get(ENDPOINTS.USER.PROFILE);

    if (response.data.success) {
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user
      };
    }

    throw new Error('فشل تحميل بيانات المستخدم');

  } catch (error) {
    console.error('Get current user error:', error);
    
    // إذا كان الخطأ 401، نقوم بتنظيف التخزين المحلي
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }

    return {
      success: false,
      message: 'فشل تحميل بيانات المستخدم'
    };
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put(ENDPOINTS.USER.UPDATE, userData);

    if (response.data.success) {
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user,
        message: response.data.message || 'تم تحديث البيانات بنجاح'
      };
    }

    throw new Error(response.data.message || 'فشل تحديث البيانات');

  } catch (error) {
    console.error('Update profile error:', error);
    
    let errorMessage = 'فشل تحديث البيانات';
    const errors = {};

    if (error.response?.data?.errors) {
      errorMessage = 'يوجد أخطاء في البيانات المدخلة';
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        errors[field] = Array.isArray(messages) ? messages[0] : messages;
      });
    }

    return {
      success: false,
      message: errorMessage,
      errors
    };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword
    });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'تم تغيير كلمة المرور بنجاح'
      };
    }

    throw new Error(response.data.message || 'فشل تغيير كلمة المرور');

  } catch (error) {
    console.error('Change password error:', error);
    
    let errorMessage = 'فشل تغيير كلمة المرور';
    
    if (error.response?.status === 401) {
      errorMessage = 'كلمة المرور الحالية غير صحيحة';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { email });

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'
      };
    }

    throw new Error(response.data.message || 'فشل إعادة تعيين كلمة المرور');

  } catch (error) {
    console.error('Reset password error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل إعادة تعيين كلمة المرور'
    };
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY, { token });

    return {
      success: response.data.success || false,
      valid: response.data.valid || false
    };

  } catch (error) {
    console.error('Verify token error:', error);
    return { success: false, valid: false };
  }
};

export const getRememberedEmail = () => {
  return localStorage.getItem('remembered_email');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export default {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  resetPassword,
  verifyToken,
  getRememberedEmail,
  isAuthenticated,
  getUserData,
  getToken,
  getRefreshToken
};