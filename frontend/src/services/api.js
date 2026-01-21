import axios from 'axios';
// إما استخدم متغير البيئة مباشرة أو تأكد من وجود الملف config/api.js
// سأغير الاستيراد ليكون أكثر مرونة
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
import { enqueueSnackbar } from 'notistack';

// إنشاء نسخة مخصصة من axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'ar',
  },
  timeout: 30000, // 30 ثانية
  timeoutErrorMessage: 'انتهت مهلة الاتصال بالخادم',
});

// إضافة معرف الطلب
api.interceptors.request.use(
  (config) => {
    // إضافة التوكن إن وجد
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // إضافة معرف الطلب للتتبع
    config.headers['X-Request-ID'] = Date.now() + Math.random().toString(36).substr(2, 9);

    // تسجيل الطلب للتطوير
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// معالج الاستجابة مع تجديد التوكن التلقائي
api.interceptors.response.use(
  (response) => {
    // تسجيل الاستجابة للتطوير
    if (process.env.NODE_ENV === 'development') {
      console.log(`📥 Response: ${response.status} ${response.config.url}`, response.data || '');
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = originalRequest.url.includes('/auth/login');
    const isRefreshRequest = originalRequest.url.includes('/auth/refresh');
    const isLogoutRequest = originalRequest.url.includes('/auth/logout');

    // تسجيل الخطأ
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // التعامل مع انقطاع الشبكة
    if (!error.response) {
      enqueueSnackbar('انقطع الاتصال بالخادم. تحقق من اتصالك بالإنترنت', { 
        variant: 'error',
        persist: true
      });
      return Promise.reject(error);
    }

    // التعامل مع أخطاء المصادقة (401)
    if (error.response?.status === 401 && !isLoginRequest && !isRefreshRequest && !isLogoutRequest) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refresh_token');
          
          if (!refreshToken) {
            throw new Error('لا يوجد توكن لتجديد الجلسة');
          }

          // طلب تجديد التوكن
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (refreshResponse.data.success) {
            const newAccessToken = refreshResponse.data.access_token;
            const newRefreshToken = refreshResponse.data.refresh_token;

            // تحديث التخزين المحلي
            localStorage.setItem('access_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refresh_token', newRefreshToken);
            }

            // إعادة الطلب الأصلي مع التوكن الجديد
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } else {
            throw new Error('فشل تجديد الجلسة');
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          
          // تنظيف التخزين المحلي وإعادة التوجيه
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          // إظهار رسالة للمستخدم
          enqueueSnackbar('انتهت جلسة العمل. يرجى تسجيل الدخول مرة أخرى', {
            variant: 'warning',
            autoHideDuration: 5000
          });

          // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم تكن فيها
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          
          return Promise.reject(refreshError);
        }
      }
    }

    // التعامل مع أخطاء أخرى
    const status = error.response?.status;
    const data = error.response?.data;

    let errorMessage = 'حدث خطأ غير متوقع';

    switch (status) {
      case 400:
        errorMessage = data?.message || 'طلب غير صالح';
        if (data?.errors) {
          // عرض أول خطأ في القائمة
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else {
            errorMessage = firstError;
          }
        }
        break;
      case 403:
        errorMessage = data?.message || 'ليس لديك صلاحية الوصول';
        break;
      case 404:
        errorMessage = data?.message || 'المورد غير موجود';
        break;
      case 422:
        errorMessage = data?.message || 'بيانات غير صالحة';
        break;
      case 423:
        errorMessage = data?.message || 'الحساب مقفل مؤقتاً';
        break;
      case 429:
        errorMessage = data?.message || 'تم تجاوز عدد المحاولات المسموح بها';
        break;
      case 500:
        errorMessage = 'خطأ في الخادم الداخلي. يرجى المحاولة لاحقاً';
        break;
      case 503:
        errorMessage = 'الخادم غير متاح حاليًا. يرجى المحاولة لاحقاً';
        break;
      default:
        errorMessage = data?.message || `خطأ ${status}`;
    }

    // عرض رسالة الخطأ للمستخدم (تجنب عرض رسائل الأخطاء في طلبات معينة)
    const shouldShowError = !isLoginRequest && !isRefreshRequest && !isLogoutRequest;
    
    if (shouldShowError && errorMessage) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        autoHideDuration: 5000
      });
    }

    // إرجاع الخطأ مع معلومات إضافية
    return Promise.reject({
      message: errorMessage,
      status,
      data,
      originalError: error
    });
  }
);

// دوال مساعدة للتحميل الملفات
api.uploadFile = async (url, file, additionalData = {}, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  };

  if (onProgress) {
    config.onUploadProgress = onProgress;
  }

  return api.post(url, formData, config);
};

// دالة لإنشاء API مخصص مع إعدادات مختلفة
api.create = (config = {}) => {
  return axios.create({
    baseURL: config.baseURL || API_BASE_URL,
    timeout: config.timeout || 30000,
    headers: {
      ...api.defaults.headers,
      ...config.headers
    }
  });
};

// إضافة قسم الاشتراكات - تم التصحيح هنا (instance -> api)
export const subscriptionsAPI = {
  // الحصول على جميع خطط الاشتراك
  getPlans: () => api.get('/subscription-plans/'),
  
  // الحصول على خطة محددة
  getPlan: (id) => api.get(`/subscription-plans/${id}/`),
  
  // إنشاء خطة جديدة (للمسؤول فقط)
  createPlan: (data) => api.post('/subscription-plans/', data),
  
  // تحديث خطة
  updatePlan: (id, data) => api.put(`/subscription-plans/${id}/`, data),
  
  // حذف خطة
  deletePlan: (id) => api.delete(`/subscription-plans/${id}/`),
  
  // الاشتراك في خطة
  subscribe: (planId) => api.post('/subscriptions/subscribe/', { plan_id: planId }),
  
  // إلغاء الاشتراك
  unsubscribe: () => api.post('/subscriptions/unsubscribe/'),
  
  // الحصول على حالة الاشتراك الحالي
  getCurrentSubscription: () => api.get('/subscriptions/current/'),
  
  // الحصول على تاريخ الاشتراكات
  getSubscriptionHistory: () => api.get('/subscriptions/history/'),
};


export default api;