// import React from 'react';
// import {
//   Box,
//   CircularProgress,
//   Typography,
//   Fade,
//   useTheme,
//   alpha
// } from '@mui/material';
// import { Science, Security, Cloud } from '@mui/icons-material';

// /**
//  * مكون عرض التحميل المتعدد الاستخدامات
//  * يدعم الأنواع المختلفة والمواقف المتعددة
//  */

// const LoadingSpinner = ({ 
//   fullScreen = false,
//   message = 'جاري التحميل...',
//   type = 'default', // default, security, science, cloud
//   size = 40,
//   color = 'primary',
//   transparent = false,
//   withIcon = true,
//   delay = 0
// }) => {
//   const theme = useTheme();
//   const [show, setShow] = React.useState(delay === 0);

//   React.useEffect(() => {
//     if (delay > 0) {
//       const timer = setTimeout(() => setShow(true), delay);
//       return () => clearTimeout(timer);
//     }
//   }, [delay]);

//   // اختيار الأيقونة حسب النوع
//   const getIcon = () => {
//     switch (type) {
//       case 'security':
//         return <Security sx={{ fontSize: size * 1.5, color: theme.palette[color].main }} />;
//       case 'science':
//         return <Science sx={{ fontSize: size * 1.5, color: theme.palette[color].main }} />;
//       case 'cloud':
//         return <Cloud sx={{ fontSize: size * 1.5, color: theme.palette[color].main }} />;
//       default:
//         return null;
//     }
//   };

//   // اختيار اللون للدائرة المتحركة
//   const getProgressColor = () => {
//     return theme.palette[color].main;
//   };

//   // اختيار رسالة افتراضية حسب النوع
//   const getDefaultMessage = () => {
//     switch (type) {
//       case 'security':
//         return 'جاري التحقق من الأمان...';
//       case 'science':
//         return 'جاري إعداد المعمل...';
//       case 'cloud':
//         return 'جاري الاتصال بالسحابة...';
//       default:
//         return 'جاري التحميل...';
//     }
//   };

//   const displayMessage = message || getDefaultMessage();

//   if (fullScreen) {
//     return (
//       <Fade in={show} timeout={500}>
//         <Box
//           sx={{
//             position: 'fixed',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             bgcolor: transparent ? alpha(theme.palette.background.default, 0.8) : theme.palette.background.default,
//             backdropFilter: transparent ? 'blur(4px)' : 'none',
//             zIndex: theme.zIndex.modal + 1,
//           }}
//         >
//           {/* الشعار */}
//           {withIcon && (
//             <Box sx={{ mb: 3, position: 'relative' }}>
//               <CircularProgress
//                 size={size * 2}
//                 thickness={2}
//                 sx={{
//                   color: getProgressColor(),
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                 }}
//               />
//               {getIcon() && (
//                 <Box sx={{ 
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)'
//                 }}>
//                   {getIcon()}
//                 </Box>
//               )}
//             </Box>
//           )}

//           {/* الرسالة */}
//           <Typography
//             variant="h6"
//             sx={{
//               color: theme.palette.text.primary,
//               fontWeight: 'medium',
//               mt: withIcon ? 0 : 3,
//               textAlign: 'center',
//               maxWidth: '80%'
//             }}
//           >
//             {displayMessage}
//           </Typography>

//           {/* مؤشر التقدم الإضافي */}
//           <CircularProgress
//             size={size}
//             thickness={4}
//             sx={{
//               color: getProgressColor(),
//               mt: 3
//             }}
//           />

//           {/* رسالة مساعدة */}
//           <Typography
//             variant="caption"
//             sx={{
//               color: theme.palette.text.secondary,
//               mt: 2,
//               textAlign: 'center',
//               maxWidth: '60%'
//             }}
//           >
//             قد تستغرق العملية بضع لحظات...
//           </Typography>
//         </Box>
//       </Fade>
//     );
//   }

//   return (
//     <Fade in={show} timeout={500}>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           py: 6,
//           width: '100%',
//         }}
//       >
//         {/* مؤشر التحميل مع أيقونة اختيارية */}
//         <Box sx={{ position: 'relative', mb: 2 }}>
//           <CircularProgress
//             size={size}
//             thickness={4}
//             sx={{
//               color: getProgressColor(),
//             }}
//           />
          
//           {withIcon && getIcon() && (
//             <Box sx={{ 
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)'
//             }}>
//               {getIcon()}
//             </Box>
//           )}
//         </Box>

//         {/* الرسالة */}
//         <Typography
//           variant="body1"
//           sx={{
//             color: theme.palette.text.primary,
//             fontWeight: 'medium',
//             textAlign: 'center'
//           }}
//         >
//           {displayMessage}
//         </Typography>

//         {/* مؤشر النقاط المتحركة */}
//         <Box sx={{ display: 'flex', gap: 0.5, mt: 2 }}>
//           {[0, 1, 2].map((index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: 6,
//                 height: 6,
//                 borderRadius: '50%',
//                 bgcolor: getProgressColor(),
//                 animation: 'pulse 1.5s ease-in-out infinite',
//                 animationDelay: `${index * 0.2}s`,
//                 '@keyframes pulse': {
//                   '0%, 100%': {
//                     opacity: 0.4,
//                     transform: 'scale(0.8)'
//                   },
//                   '50%': {
//                     opacity: 1,
//                     transform: 'scale(1)'
//                   }
//                 }
//               }}
//             />
//           ))}
//         </Box>
//       </Box>
//     </Fade>
//   );
// };

// // نوع خاص للصفحة الرئيسية
// export const HomeLoadingSpinner = () => (
//   <LoadingSpinner 
//     fullScreen 
//     type="security" 
//     message="جاري إعداد منصة CyberLabs..." 
//     size={60}
//   />
// );

// // نوع خاص للمصادقة
// export const AuthLoadingSpinner = () => (
//   <LoadingSpinner 
//     fullScreen 
//     type="security" 
//     message="جاري التحقق من بيانات الدخول..." 
//     size={50}
//   />
// );

// // نوع خاص للمعامل
// export const LabsLoadingSpinner = () => (
//   <LoadingSpinner 
//     fullScreen 
//     type="science" 
//     message="جاري تحميل المعامل..." 
//     size={50}
//   />
// );

// // نوع خاص لواجهة المستخدم
// export const InlineLoadingSpinner = ({ message }) => (
//   <LoadingSpinner 
//     message={message} 
//     size={20} 
//     withIcon={false}
//   />
// );

// export default LoadingSpinner;

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'جاري التحميل...', fullScreen = false }) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: 'primary.main'
        }}
      />
      
      {message && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontWeight: 'medium'
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          zIndex: 9999
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;