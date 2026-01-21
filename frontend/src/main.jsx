// import React, { useState, useEffect, Suspense, lazy } from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { HelmetProvider } from 'react-helmet-async';
// import { ThemeProvider, CssBaseline } from '@mui/material';
// import { SnackbarProvider } from 'notistack';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { ErrorBoundary } from 'react-error-boundary';

// // السياقات والمكونات الأساسية
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
// import { NotificationProvider } from './contexts/NotificationContext';
// import { LoadingProvider } from './contexts/LoadingContext';

// // المكونات
// import LoadingSpinner from './components/common/LoadingSpinner';
// import ErrorFallback from './components/common/ErrorFallback';
// import AppInitializer from './components/AppInitializer';

// // الأنماط
// import './index.css';

// // إنشاء عميل Query مع إعدادات مخصصة
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 دقائق
//       cacheTime: 10 * 60 * 1000, // 10 دقائق
//       retry: 2,
//       retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//       refetchOnWindowFocus: false,
//       refetchOnMount: true,
//       refetchOnReconnect: true,
//     },
//     mutations: {
//       retry: 1,
//     },
//   },
// });

// // مكون App الرئيسي مع lazy loading
// const App = lazy(() => import('./App'));

// // مكون تهيئة التطبيق
// const AppWrapper = () => {
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const initializeApp = async () => {
//       try {
//         // تحميل البيانات الأولية
//         const fontLoadPromise = new Promise((resolve) => {
//           if (document.fonts) {
//             document.fonts.load('1rem "Cairo"').then(resolve);
//           } else {
//             resolve();
//           }
//         });

//         const configLoadPromise = new Promise((resolve) => {
//           // تحميل الإعدادات من localStorage أو API
//           setTimeout(resolve, 100);
//         });

//         await Promise.all([fontLoadPromise, configLoadPromise]);
//         setIsInitialized(true);
//       } catch (err) {
//         console.error('فشل في تهيئة التطبيق:', err);
//         setError(err);
//       }
//     };

//     initializeApp();
//   }, []);

//   if (error) {
//     return (
//       <ErrorFallback 
//         error={error} 
//         resetErrorBoundary={() => window.location.reload()}
//       />
//     );
//   }

//   if (!isInitialized) {
//     return <LoadingSpinner fullScreen type="security" message="جاري تهيئة CyberLabs..." />;
//   }

//   return (
//     <Suspense fallback={<LoadingSpinner fullScreen />}>
//       <App />
//     </Suspense>
//   );
// };

// // العنصر الجذر الرئيسي
// const rootElement = document.getElementById('root');

// if (!rootElement) {
//   console.error('❌ لم يتم العثور على عنصر root في DOM');
//   throw new Error('عنصر الجذر غير موجود');
// }

// const root = ReactDOM.createRoot(rootElement);

// // تتبع أداء التطبيق
// if (process.env.NODE_ENV === 'development') {
//   // إضافة أدوات التطوير
//   window.APP_PERF_START = performance.now();
// }

// // مكون الحماية من الأخطاء
// const ErrorBoundaryWrapper = ({ children }) => (
//   <ErrorBoundary
//     FallbackComponent={ErrorFallback}
//     onReset={() => {
//       // إعادة تعيين حالة التطبيق عند حدوث خطأ
//       window.location.reload();
//     }}
//     onError={(error, errorInfo) => {
//       // تسجيل الأخطاء إلى خدمة المراقبة
//       console.error('خطأ غير متوقع:', error, errorInfo);
      
//       if (process.env.NODE_ENV === 'production') {
//         // إرسال الخطأ إلى خدمة المراقبة
//         // sendErrorToMonitoring(error, errorInfo);
//       }
//     }}
//   >
//     {children}
//   </ErrorBoundary>
// );

// // تهيئة وتشغيل التطبيق
// try {
//   root.render(
//     <React.StrictMode>
//       <ErrorBoundaryWrapper>
//         <HelmetProvider>
//           <QueryClientProvider client={queryClient}>
//             <BrowserRouter future={{
//               v7_startTransition: true,
//               v7_relativeSplatPath: true,
//             }}>
//               <CustomThemeProvider>
//                 <ThemeProvider>
//                   <CssBaseline />
//                   <SnackbarProvider
//                     maxSnack={5}
//                     anchorOrigin={{
//                       vertical: 'top',
//                       horizontal: 'left',
//                     }}
//                     autoHideDuration={5000}
//                     preventDuplicate
//                     dense
//                     hideIconVariant={false}
//                     TransitionProps={{ direction: 'left' }}
//                     style={{
//                       fontFamily: 'Cairo, sans-serif',
//                       direction: 'rtl',
//                     }}
//                   >
//                     <NotificationProvider>
//                       <LoadingProvider>
//                         <AuthProvider>
//                           <AppInitializer>
//                             <AppWrapper />
//                           </AppInitializer>
//                         </AuthProvider>
//                       </LoadingProvider>
//                     </NotificationProvider>
//                   </SnackbarProvider>
//                 </ThemeProvider>
//               </CustomThemeProvider>
//             </BrowserRouter>
            
//             {process.env.NODE_ENV === 'development' && (
//               <ReactQueryDevtools 
//                 initialIsOpen={false} 
//                 position="bottom-right"
//                 panelProps={{
//                   style: {
//                     direction: 'rtl',
//                     fontFamily: 'Cairo, sans-serif',
//                   }
//                 }}
//               />
//             )}
//           </QueryClientProvider>
//         </HelmetProvider>
//       </ErrorBoundaryWrapper>
//     </React.StrictMode>
//   );

//   // تتبع وقت تحميل التطبيق
//   if (process.env.NODE_ENV === 'development') {
//     const loadTime = performance.now() - window.APP_PERF_START;
//     console.log(`🚀 تم تحميل التطبيق خلال ${loadTime.toFixed(2)}ms`);
//   }

//   // تسجيل معلومات التطبيق
//   console.log('🎯 CyberLabs Frontend تم تحميله بنجاح');
//   console.log('🌐 البيئة:', process.env.NODE_ENV);
//   console.log('📅 الوقت:', new Date().toLocaleString('ar-SA'));
  
// } catch (error) {
//   console.error('❌ فشل في تحميل التطبيق:', error);
  
//   // عرض رسالة خطأ للمستخدم
//   const errorElement = document.createElement('div');
//   errorElement.style.cssText = `
//     position: fixed;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//     color: white;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     text-align: center;
//     padding: 2rem;
//     font-family: 'Cairo', sans-serif;
//     direction: rtl;
//     z-index: 9999;
//   `;
  
//   errorElement.innerHTML = `
//     <div style="max-width: 600px;">
//       <h1 style="font-size: 3rem; margin-bottom: 1rem;">😔 حدث خطأ غير متوقع</h1>
//       <p style="font-size: 1.2rem; margin-bottom: 2rem;">
//         عذراً، حدث خطأ أثناء تحميل التطبيق. يرجى تحديث الصفحة أو المحاولة لاحقاً.
//       </p>
//       <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
//         <code style="font-family: monospace; word-break: break-all;">
//           ${error.message || 'خطأ غير معروف'}
//         </code>
//       </div>
//       <button onclick="window.location.reload()" style="
//         background: white;
//         color: #667eea;
//         border: none;
//         padding: 0.75rem 2rem;
//         border-radius: 8px;
//         font-size: 1.1rem;
//         font-weight: bold;
//         cursor: pointer;
//         transition: transform 0.2s;
//       ">
//         ↻ إعادة تحميل الصفحة
//       </button>
//       <p style="margin-top: 2rem; opacity: 0.8;">
//         إذا استمرت المشكلة، يرجى الاتصال بالدعم الفني.
//       </p>
//     </div>
//   `;
  
//   document.body.appendChild(errorElement);
// }

// // تحسينات للأداء والتجربة
// if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then((registration) => {
//         console.log('✅ Service Worker مسجل:', registration);
//       })
//       .catch((error) => {
//         console.log('❌ فشل في تسجيل Service Worker:', error);
//       });
//   });
// }

// // تحسينات للوضع غير المتصل
// window.addEventListener('online', () => {
//   if ('Notification' in window && Notification.permission === 'granted') {
//     new Notification('CyberLabs', {
//       body: 'تم استعادة الاتصال بالإنترنت',
//       icon: '/logo.png',
//     });
//   }
// });

// window.addEventListener('offline', () => {
//   console.warn('⚠️ فقد الاتصال بالإنترنت');
// });

// // معالجة أخطاء التحميل
// window.addEventListener('error', (event) => {
//   console.error('خطأ في تحميل المورد:', event);
// });

// // معالجة أخطاء Promise غير المعالجة
// window.addEventListener('unhandledrejection', (event) => {
//   console.error('Promise غير معالج:', event.reason);
// });

// // تحسينات لتجربة المستخدم
// document.addEventListener('DOMContentLoaded', () => {
//   // تحسينات للوحة المفاتيح على الأجهزة المحمولة
//   if ('virtualKeyboard' in navigator) {
//     navigator.virtualKeyboard.overlaysContent = true;
//   }
  
//   // تحسينات لللمس
//   if ('ontouchstart' in window) {
//     document.documentElement.style.setProperty('--touch-optimized', 'true');
//   }
// });

// // دعم PWA
// if ('standalone' in navigator || window.matchMedia('(display-mode: standalone)').matches) {
//   console.log('📱 التطبيق يعمل في وضع PWA');
// }

// // تصدير للاختبارات
// export { queryClient };

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);