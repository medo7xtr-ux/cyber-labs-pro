/**
 * ملف إعدادات API الشامل
 * يحتوي على جميع المسارات والتكوينات اللازمة
 */

// حالة البيئة
const ENV = process.env.NODE_ENV || 'development';

// إعدادات API حسب البيئة
export const API_CONFIGS = {
  development: {
    baseURL: 'http://127.0.0.1:8000/api/v1',
    mediaURL: 'http://127.0.0.1:8000/media',
    websocketURL: 'ws://127.0.0.1:8000/ws',
    timeout: 30000,
    debug: true
  },
  staging: {
    baseURL: 'https://staging-api.cyberlabs.com/api/v1',
    mediaURL: 'https://staging-media.cyberlabs.com',
    websocketURL: 'wss://staging-api.cyberlabs.com/ws',
    timeout: 25000,
    debug: true
  },
  production: {
    baseURL: 'https://api.cyberlabs.com/api/v1',
    mediaURL: 'https://media.cyberlabs.com',
    websocketURL: 'wss://api.cyberlabs.com/ws',
    timeout: 20000,
    debug: false
  }
};

// الحصول على الإعدادات الحالية
const currentConfig = API_CONFIGS[ENV] || API_CONFIGS.development;

// تصدير الإعدادات
export const API_BASE_URL = process.env.REACT_APP_API_URL || currentConfig.baseURL;
export const MEDIA_URL = process.env.REACT_APP_MEDIA_URL || currentConfig.mediaURL;
export const WEBSOCKET_URL = process.env.REACT_APP_WS_URL || currentConfig.websocketURL;
export const API_TIMEOUT = currentConfig.timeout;
export const DEBUG_MODE = currentConfig.debug;

// رؤوس HTTP الافتراضية
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Accept-Language': 'ar',
  'X-Application': 'CyberLabs-Web',
  'X-Version': '1.0.0'
};

// مسارات API
export const ENDPOINTS = {
  // المصادقة والمستخدمين
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    SOCIAL_LOGIN: (provider) => `/auth/social/${provider}`,
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification'
  },
  
  // المستخدمين
  USER: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    AVATAR: '/users/avatar',
    STATS: '/users/stats',
    ACTIVITY: '/users/activity',
    SETTINGS: '/users/settings',
    NOTIFICATIONS: '/users/notifications',
    ACHIEVEMENTS: '/users/achievements',
    SUBSCRIPTION: '/users/subscription',
    LEADERBOARD: '/users/leaderboard',
    FRIENDS: '/users/friends',
    BY_ID: (id) => `/users/${id}`
  },
  
  // المعامل
  LABS: {
    LIST: '/labs',
    DETAIL: (id) => `/labs/${id}`,
    CREATE: '/labs',
    UPDATE: (id) => `/labs/${id}`,
    DELETE: (id) => `/labs/${id}`,
    
    // التحديات
    CHALLENGES: (labId) => `/labs/${labId}/challenges`,
    CHALLENGE_DETAIL: (labId, challengeId) => `/labs/${labId}/challenges/${challengeId}`,
    
    // العمليات
    START: (labId) => `/labs/${labId}/start`,
    COMPLETE: (labId) => `/labs/${labId}/complete`,
    SUBMIT: (labId, challengeId) => `/labs/${labId}/challenges/${challengeId}/submit`,
    HINT: (labId, challengeId) => `/labs/${labId}/challenges/${challengeId}/hint`,
    
    // الإحصائيات والتقدم
    STATISTICS: (labId) => `/labs/${labId}/statistics`,
    USER_PROGRESS: (labId) => `/labs/${labId}/user-progress`,
    LEADERBOARD: (labId) => `/labs/${id}/leaderboard`,
    
    // الفلترة والبحث
    SEARCH: '/labs/search',
    CATEGORIES: '/labs/categories',
    TAGS: '/labs/tags',
    FILTER: '/labs/filter',
    
    // التقييمات والتعليقات
    REVIEWS: (labId) => `/labs/${labId}/reviews`,
    RATE: (labId) => `/labs/${labId}/rate`,
    COMMENTS: (labId) => `/labs/${labId}/comments`,
    
    // المستخدم
    USER_LABS: (userId) => `/users/${userId}/labs`,
    COMPLETED_LABS: '/labs/completed',
    IN_PROGRESS_LABS: '/labs/in-progress'
  },
  
  // الدورات التعليمية
  TUTORIALS: {
    LIST: '/tutorials',
    DETAIL: (id) => `/tutorials/${id}`,
    CATEGORIES: '/tutorials/categories',
    SEARCH: '/tutorials/search',
    COMPLETE: (id) => `/tutorials/${id}/complete`
  },
  
  // التقارير والإحصائيات
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    DETAIL: (id) => `/reports/${id}`,
    USER_REPORTS: '/reports/user',
    STATS: '/reports/stats',
    EXPORT: (id) => `/reports/${id}/export`
  },
  
  // الاشتراكات
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CURRENT: '/subscriptions/current',
    UPGRADE: '/subscriptions/upgrade',
    CANCEL: '/subscriptions/cancel',
    HISTORY: '/subscriptions/history',
    PAYMENT_METHODS: '/subscriptions/payment-methods',
    INVOICES: '/subscriptions/invoices'
  },
  
  // المناقشات والمجتمع
  COMMUNITY: {
    FORUMS: '/community/forums',
    POSTS: (forumId) => `/community/forums/${forumId}/posts`,
    COMMENTS: (postId) => `/community/posts/${postId}/comments`,
    LIKE: (postId) => `/community/posts/${postId}/like`
  },
  
  // الملفات والوسائط
  MEDIA: {
    UPLOAD: '/media/upload',
    DELETE: (id) => `/media/${id}`,
    LIST: '/media'
  },
  
  // الإشعارات
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD: '/notifications/unread',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    SETTINGS: '/notifications/settings'
  },
  
  // المساعدة والدعم
  SUPPORT: {
    TICKETS: '/support/tickets',
    TICKET_DETAIL: (id) => `/support/tickets/${id}`,
    FAQ: '/support/faq',
    CONTACT: '/support/contact'
  }
};

// خرائط للتحويل
export const CATEGORY_MAP = {
  web_security: { ar: 'أمن الويب', en: 'Web Security', icon: '🌐', color: '#1976d2' },
  network_security: { ar: 'أمن الشبكات', en: 'Network Security', icon: '🔗', color: '#9c27b0' },
  cryptography: { ar: 'التشفير', en: 'Cryptography', icon: '🔐', color: '#2e7d32' },
  digital_forensics: { ar: 'التحقيق الجنائي الرقمي', en: 'Digital Forensics', icon: '🔍', color: '#ed6c02' },
  reverse_engineering: { ar: 'الهندسة العكسية', en: 'Reverse Engineering', icon: '⚙️', color: '#0288d1' },
  malware_analysis: { ar: 'تحليل البرمجيات الخبيثة', en: 'Malware Analysis', icon: '🦠', color: '#d32f2f' },
  social_engineering: { ar: 'الهندسة الاجتماعية', en: 'Social Engineering', icon: '👥', color: '#7b1fa2' },
  iot_security: { ar: 'أمن إنترنت الأشياء', en: 'IoT Security', icon: '📱', color: '#0097a7' },
  mobile_security: { ar: 'أمن الهواتف', en: 'Mobile Security', icon: '📲', color: '#ff9800' },
  cloud_security: { ar: 'أمن السحابة', en: 'Cloud Security', icon: '☁️', color: '#00acc1' }
};

export const DIFFICULTY_MAP = {
  beginner: { 
    ar: 'مبتدئ', 
    en: 'Beginner', 
    color: '#4caf50',
    icon: '🌱',
    level: 1,
    description: 'مناسب للمبتدئين في الأمن السيبراني'
  },
  intermediate: { 
    ar: 'متوسط', 
    en: 'Intermediate', 
    color: '#ff9800',
    icon: '🌿',
    level: 2,
    description: 'يتطلب معرفة أساسية بالأمن السيبراني'
  },
  advanced: { 
    ar: 'متقدم', 
    en: 'Advanced', 
    color: '#f44336',
    icon: '🌳',
    level: 3,
    description: 'يتطلب خبرة متقدمة في الأمن السيبراني'
  },
  expert: { 
    ar: 'خبير', 
    en: 'Expert', 
    color: '#9c27b0',
    icon: '🔥',
    level: 4,
    description: 'للمحترفين ذوي الخبرة العميقة'
  }
};

// حالات المعمل
export const LAB_STATUS = {
  NOT_STARTED: { ar: 'لم يبدأ', en: 'Not Started', color: '#9e9e9e' },
  IN_PROGRESS: { ar: 'قيد التنفيذ', en: 'In Progress', color: '#2196f3' },
  COMPLETED: { ar: 'مكتمل', en: 'Completed', color: '#4caf50' },
  PAUSED: { ar: 'متوقف', en: 'Paused', color: '#ff9800' },
  EXPIRED: { ar: 'منتهي', en: 'Expired', color: '#f44336' }
};

// أنواع التحديات
export const CHALLENGE_TYPES = {
  MULTIPLE_CHOICE: { ar: 'اختيار متعدد', en: 'Multiple Choice', icon: '☑️' },
  CODE: { ar: 'برمجة', en: 'Code', icon: '💻' },
  FLAG: { ar: 'علم', en: 'Flag', icon: '🚩' },
  PRACTICAL: { ar: 'عملي', en: 'Practical', icon: '🔧' },
  THEORY: { ar: 'نظري', en: 'Theory', icon: '📚' }
};

// دوال مساعدة
export const getCategoryInfo = (category) => {
  return CATEGORY_MAP[category] || { ar: category, en: category, icon: '🔧', color: '#757575' };
};

export const getDifficultyInfo = (difficulty) => {
  return DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP.beginner;
};

export const getLabStatusInfo = (status) => {
  return LAB_STATUS[status] || LAB_STATUS.NOT_STARTED;
};

export const getChallengeTypeInfo = (type) => {
  return CHALLENGE_TYPES[type] || { ar: type, en: type, icon: '❓' };
};

// دوال بناء URL
export const buildLabUrl = (labId) => `${API_BASE_URL}/labs/${labId}`;
export const buildMediaUrl = (path) => `${MEDIA_URL}/${path}`;
export const buildAvatarUrl = (userId, size = 200) => 
  `${MEDIA_URL}/avatars/${userId}/${size}.jpg`;

// إعدادات التطبيق العامة
export const APP_CONFIG = {
  APP_NAME: 'CyberLabs',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'منصة تعليمية متخصصة في الأمن السيبراني',
  CONTACT_EMAIL: 'support@cyberlabs.com',
  SUPPORT_PHONE: '+966 12 345 6789',
  COMPANY_NAME: 'CyberLabs LLC',
  COMPANY_ADDRESS: 'الرياض، المملكة العربية السعودية',
  
  // الميزات
  FEATURES: {
    LABS: true,
    TUTORIALS: true,
    COMMUNITY: true,
    CERTIFICATES: true,
    GAMIFICATION: true,
    MOBILE_APP: false
  },
  
  // الحدود
  LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
    MAX_LABS_PER_PAGE: 24,
    MAX_SUBMISSIONS_PER_HOUR: 100,
    SESSION_TIMEOUT: 60 * 60 * 1000 // ساعة واحدة
  },
  
  // الألوان
  COLORS: {
    PRIMARY: '#1976d2',
    SECONDARY: '#9c27b0',
    SUCCESS: '#2e7d32',
    WARNING: '#ed6c02',
    ERROR: '#d32f2f',
    INFO: '#0288d1'
  }
};

// تصدير جميع الإعدادات
export default {
  API_BASE_URL,
  MEDIA_URL,
  WEBSOCKET_URL,
  API_TIMEOUT,
  DEBUG_MODE,
  DEFAULT_HEADERS,
  ENDPOINTS,
  CATEGORY_MAP,
  DIFFICULTY_MAP,
  LAB_STATUS,
  CHALLENGE_TYPES,
  APP_CONFIG,
  getCategoryInfo,
  getDifficultyInfo,
  getLabStatusInfo,
  getChallengeTypeInfo,
  buildLabUrl,
  buildMediaUrl,
  buildAvatarUrl
};