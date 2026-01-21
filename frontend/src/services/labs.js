import api from './api';
import { ENDPOINTS } from '../config/api';
import { enqueueSnackbar } from 'notistack';

/**
 * خدمة المعامل المتكاملة
 * تدعم جميع عمليات المعامل والتحديات والإحصائيات
 */

// الخيارات الافتراضية للاستعلام
const DEFAULT_OPTIONS = {
  page: 1,
  limit: 12,
  sort_by: 'created_at',
  sort_order: 'desc'
};

// ذاكرة مؤقتة للطلبات
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

// دالة مساعدة للذاكرة المؤقتة
const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// تصنيف المعامل حسب الصعوبة
export const LAB_DIFFICULTIES = {
  beginner: { label: 'مبتدئ', color: 'success', points: 100 },
  intermediate: { label: 'متوسط', color: 'warning', points: 200 },
  advanced: { label: 'متقدم', color: 'error', points: 300 },
  expert: { label: 'خبير', color: 'secondary', points: 500 }
};

// الحصول على جميع المعامل مع فلترة وترتيب
export const getAllLabs = async (options = {}) => {
  try {
    const cacheKey = `labs_${JSON.stringify(options)}`;
    const cached = getCachedData(cacheKey);
    
    if (cached && !options.forceRefresh) {
      return cached;
    }

    const params = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    const response = await api.get(ENDPOINTS.LABS.LIST, { params });

    if (response.data.success) {
      const result = {
        success: true,
        labs: response.data.labs || [],
        pagination: response.data.pagination || {
          page: 1,
          total_pages: 1,
          total_items: 0
        },
        filters: response.data.filters || {}
      };

      setCachedData(cacheKey, result);
      return result;
    }

    throw new Error(response.data.message || 'فشل في تحميل المعامل');

  } catch (error) {
    console.error('Error fetching labs:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل المعامل',
      labs: [],
      pagination: DEFAULT_OPTIONS,
      error: error.response?.data
    };
  }
};

// الحصول على معمل محدد
export const getLabById = async (id, options = {}) => {
  try {
    const cacheKey = `lab_${id}`;
    const cached = getCachedData(cacheKey);
    
    if (cached && !options.forceRefresh) {
      return cached;
    }

    const response = await api.get(ENDPOINTS.LABS.DETAIL(id));

    if (response.data.success) {
      const lab = response.data.lab;
      
      // إضافة معلومات إضافية
      const enrichedLab = {
        ...lab,
        difficulty_info: LAB_DIFFICULTIES[lab.difficulty] || LAB_DIFFICULTIES.beginner,
        is_started: lab.user_progress?.started || false,
        is_completed: lab.user_progress?.completed || false,
        user_progress: lab.user_progress || {},
        prerequisites: lab.prerequisites || [],
        tags: lab.tags || []
      };

      const result = {
        success: true,
        lab: enrichedLab
      };

      setCachedData(cacheKey, result);
      return result;
    }

    throw new Error(response.data.message || 'فشل في تحميل المعمل');

  } catch (error) {
    console.error(`Error fetching lab ${id}:`, error);
    
    // إذا كان الخطأ 404، نقوم بإزالة المعمل من الذاكرة المؤقتة
    if (error.response?.status === 404) {
      cache.delete(`lab_${id}`);
    }

    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل المعمل',
      lab: null,
      error: error.response?.data
    };
  }
};

// بدء معمل جديد
export const startLab = async (labId) => {
  try {
    const response = await api.post(ENDPOINTS.LABS.START(labId));

    if (response.data.success) {
      enqueueSnackbar('تم بدء المعمل بنجاح!', {
        variant: 'success',
        autoHideDuration: 3000
      });

      // إزالة الذاكرة المؤقتة لهذا المعمل
      cache.delete(`lab_${labId}`);
      cache.delete(`user_labs_${labId}`);

      return {
        success: true,
        session: response.data.session,
        message: response.data.message || 'تم بدء المعمل بنجاح'
      };
    }

    throw new Error(response.data.message || 'فشل في بدء المعمل');

  } catch (error) {
    console.error(`Error starting lab ${labId}:`, error);
    
    let message = 'فشل في بدء المعمل';
    
    if (error.response?.status === 402) {
      message = 'يجب الاشتراك في الخطة المميزة للوصول إلى هذا المعمل';
    } else if (error.response?.status === 403) {
      message = 'ليس لديك صلاحية لبدء هذا المعمل';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    enqueueSnackbar(message, {
      variant: 'error',
      autoHideDuration: 5000
    });

    return {
      success: false,
      message,
      error: error.response?.data
    };
  }
};

// إرسال حل لتحدي
export const submitChallenge = async (labId, challengeId, submission) => {
  try {
    const response = await api.post(ENDPOINTS.LABS.SUBMIT(labId, challengeId), submission);

    if (response.data.success) {
      const isCorrect = response.data.correct;
      const message = isCorrect 
        ? '🎉 مبروك! الإجابة صحيحة' 
        : '❌ الإجابة غير صحيحة، حاول مرة أخرى';

      enqueueSnackbar(message, {
        variant: isCorrect ? 'success' : 'error',
        autoHideDuration: 3000
      });

      return {
        success: true,
        correct: isCorrect,
        score: response.data.score,
        feedback: response.data.feedback,
        hint: response.data.hint,
        next_challenge: response.data.next_challenge
      };
    }

    throw new Error(response.data.message || 'فشل في إرسال الحل');

  } catch (error) {
    console.error(`Error submitting challenge ${challengeId}:`, error);
    
    let message = 'فشل في إرسال الحل';
    let showSnackbar = true;

    if (error.response?.status === 429) {
      message = 'لقد تجاوزت الحد المسموح للمحاولات، حاول لاحقاً';
    } else if (error.response?.status === 403) {
      message = 'ليس لديك صلاحية لإرسال حل لهذا التحدي';
    } else if (error.response?.status === 400) {
      message = 'الحل غير صالح أو مرفوض';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else {
      showSnackbar = false;
    }

    if (showSnackbar) {
      enqueueSnackbar(message, {
        variant: 'error',
        autoHideDuration: 5000
      });
    }

    return {
      success: false,
      message,
      error: error.response?.data
    };
  }
};

// الحصول على تحديات المعمل
export const getLabChallenges = async (labId, options = {}) => {
  try {
    const cacheKey = `lab_challenges_${labId}`;
    const cached = getCachedData(cacheKey);
    
    if (cached && !options.forceRefresh) {
      return cached;
    }

    const response = await api.get(ENDPOINTS.LABS.CHALLENGES(labId));

    if (response.data.success) {
      const challenges = (response.data.challenges || []).map(challenge => ({
        ...challenge,
        difficulty_info: LAB_DIFFICULTIES[challenge.difficulty] || LAB_DIFFICULTIES.beginner,
        user_submission: challenge.user_submission || null,
        hints_used: challenge.hints_used || 0
      }));

      const result = {
        success: true,
        challenges,
        total: response.data.total || 0,
        completed: response.data.completed || 0
      };

      setCachedData(cacheKey, result);
      return result;
    }

    throw new Error(response.data.message || 'فشل في تحميل التحديات');

  } catch (error) {
    console.error(`Error fetching challenges for lab ${labId}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل التحديات',
      challenges: [],
      total: 0,
      completed: 0
    };
  }
};

// الحصول على إحصائيات المعمل
export const getLabStatistics = async (labId) => {
  try {
    const response = await api.get(ENDPOINTS.LABS.STATISTICS(labId));

    if (response.data.success) {
      return {
        success: true,
        statistics: response.data.statistics,
        leaderboard: response.data.leaderboard || [],
        user_rank: response.data.user_rank,
        completion_rate: response.data.completion_rate
      };
    }

    throw new Error(response.data.message || 'فشل في تحميل الإحصائيات');

  } catch (error) {
    console.error(`Error fetching statistics for lab ${labId}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل الإحصائيات',
      statistics: null,
      leaderboard: []
    };
  }
};

// البحث في المعامل
export const searchLabs = async (query, filters = {}) => {
  try {
    const params = {
      q: query,
      ...filters,
      limit: 20
    };

    const response = await api.get(ENDPOINTS.LABS.SEARCH, { params });

    if (response.data.success) {
      return {
        success: true,
        labs: response.data.labs || [],
        total: response.data.total || 0,
        query,
        filters
      };
    }

    throw new Error(response.data.message || 'فشل في البحث');

  } catch (error) {
    console.error('Error searching labs:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في البحث',
      labs: [],
      total: 0
    };
  }
};

// الحصول على التصنيفات
export const getCategories = async () => {
  try {
    const cacheKey = 'categories';
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await api.get(ENDPOINTS.LABS.CATEGORIES);

    if (response.data.success) {
      const result = {
        success: true,
        categories: response.data.categories || []
      };

      setCachedData(cacheKey, result);
      return result;
    }

    throw new Error(response.data.message || 'فشل في تحميل التصنيفات');

  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل التصنيفات',
      categories: []
    };
  }
};

// الحصول على المعامل التي بدأها المستخدم
export const getUserLabs = async (userId, status = 'all') => {
  try {
    const cacheKey = `user_labs_${userId}_${status}`;
    const cached = getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await api.get(`/users/${userId}/labs`, {
      params: { status }
    });

    if (response.data.success) {
      const result = {
        success: true,
        labs: response.data.labs || [],
        total: response.data.total || 0,
        completed: response.data.completed || 0,
        in_progress: response.data.in_progress || 0
      };

      setCachedData(cacheKey, result);
      return result;
    }

    throw new Error(response.data.message || 'فشل في تحميل معامل المستخدم');

  } catch (error) {
    console.error(`Error fetching user labs for ${userId}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل معامل المستخدم',
      labs: [],
      total: 0
    };
  }
};

// الحصول على تقدم المستخدم في المعمل
export const getUserLabProgress = async (labId) => {
  try {
    const response = await api.get(`/labs/${labId}/user-progress`);

    if (response.data.success) {
      return {
        success: true,
        progress: response.data.progress,
        current_challenge: response.data.current_challenge,
        score: response.data.score,
        time_spent: response.data.time_spent,
        started_at: response.data.started_at,
        completed_at: response.data.completed_at
      };
    }

    throw new Error(response.data.message || 'فشل في تحميل التقدم');

  } catch (error) {
    console.error(`Error fetching user progress for lab ${labId}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في تحميل التقدم',
      progress: null
    };
  }
};

// إنهاء المعمل
export const completeLab = async (labId) => {
  try {
    const response = await api.post(`/labs/${labId}/complete`);

    if (response.data.success) {
      enqueueSnackbar('🎉 مبروك! لقد أكملت المعمل بنجاح', {
        variant: 'success',
        autoHideDuration: 5000
      });

      // إزالة الذاكرة المؤقتة
      cache.delete(`lab_${labId}`);
      cache.delete(`user_labs_${labId}`);

      return {
        success: true,
        certificate: response.data.certificate,
        points_earned: response.data.points_earned,
        badge: response.data.badge,
        message: response.data.message || 'تم إكمال المعمل بنجاح'
      };
    }

    throw new Error(response.data.message || 'فشل في إنهاء المعمل');

  } catch (error) {
    console.error(`Error completing lab ${labId}:`, error);
    
    enqueueSnackbar(error.response?.data?.message || 'فشل في إنهاء المعمل', {
      variant: 'error',
      autoHideDuration: 5000
    });

    return {
      success: false,
      message: error.response?.data?.message || 'فشل في إنهاء المعمل'
    };
  }
};

// الحصول على تلميح للتحدي
export const getChallengeHint = async (labId, challengeId) => {
  try {
    const response = await api.get(`/labs/${labId}/challenges/${challengeId}/hint`);

    if (response.data.success) {
      return {
        success: true,
        hint: response.data.hint,
        cost: response.data.cost || 0,
        hints_remaining: response.data.hints_remaining || 0
      };
    }

    throw new Error(response.data.message || 'فشل في الحصول على التلميح');

  } catch (error) {
    console.error(`Error getting hint for challenge ${challengeId}:`, error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في الحصول على التلميح',
      hint: null
    };
  }
};

// مسح الذاكرة المؤقتة
export const clearCache = () => {
  cache.clear();
  enqueueSnackbar('تم مسح الذاكرة المؤقتة', {
    variant: 'info',
    autoHideDuration: 2000
  });
};

export default {
  getAllLabs,
  getLabById,
  startLab,
  submitChallenge,
  getLabChallenges,
  getLabStatistics,
  searchLabs,
  getCategories,
  getUserLabs,
  getUserLabProgress,
  completeLab,
  getChallengeHint,
  clearCache,
  LAB_DIFFICULTIES
};