import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  Grid,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  useTheme,
  alpha,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Security,
  Google,
  GitHub,
  Twitter,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { login, loading: authLoading, getRememberedEmail } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // تحميل البريد الإلكتروني المحفوظ
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }

    // تحقق إذا كان المستخدم موجه من صفحة محمية
    const fromProtected = location.state?.from;
    if (fromProtected) {
      enqueueSnackbar('يجب تسجيل الدخول للوصول إلى هذه الصفحة', { 
        variant: 'info',
        autoHideDuration: 3000
      });
    }
  }, [getRememberedEmail, location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // مسح خطأ الحقل عند التعديل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password, formData.rememberMe);
      
      if (result.success) {
        enqueueSnackbar('تم تسجيل الدخول بنجاح', { 
          variant: 'success',
          autoHideDuration: 2000
        });
        
        // التوجيه إلى الصفحة السابقة أو لوحة التحكم
        const redirectTo = location.state?.from || '/dashboard';
        setTimeout(() => navigate(redirectTo, { replace: true }), 500);
        
      } else {
        setErrors({
          general: result.message || 'فشل تسجيل الدخول'
        });
      }
    } catch (error) {
      setErrors({
        general: error.message || 'حدث خطأ غير متوقع'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    enqueueSnackbar(`جارٍ إعداد تسجيل الدخول عبر ${provider}...`, { 
      variant: 'info',
      autoHideDuration: 3000
    });
    // TODO: تنفيذ تسجيل الدخول عبر وسائل التواصل
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      enqueueSnackbar('يرجى إدخال البريد الإلكتروني أولاً', { 
        variant: 'warning',
        autoHideDuration: 3000
      });
      return;
    }
    navigate('/forgot-password', { state: { email: formData.email } });
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen type="security" message="جاري التحقق من الجلسة..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231976d2' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          opacity: 0.3,
          zIndex: 0,
        }
      }}
    >
      {/* زر العودة */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },
          zIndex: 1
        }}
      >
        العودة للرئيسية
      </Button>

      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Grid container spacing={6} alignItems="center">
            {/* قسم الصورة والمعلومات */}
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative', textAlign: 'center' }}>
                {/* شعار وأيقونة */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
                  <Security sx={{ fontSize: 60, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      CyberLabs
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      الأمن السيبراني بمتناول يدك
                    </Typography>
                  </Box>
                </Box>

                {/* صورة توضيحية */}
                <Box
                  component="img"
                  src="/api/placeholder/500/400"
                  alt="Cyber Security"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />

                {/* مزايا المنصة */}
                <Box sx={{ mt: 6, textAlign: 'right' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    لماذا تسجل في CyberLabs؟
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      '🧪 معامل تفاعلية حقيقية',
                      '📊 تتبع تقدم شخصي',
                      '👨‍🏫 دعم من خبراء متخصصين',
                      '🏆 شهادات معتمدة',
                      '👥 مجتمع نشط وداعم',
                      '📱 منصة متكاملة ومتجاوبة'
                    ].map((feature, index) => (
                      <Grid item xs={6} key={index}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {feature}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* قسم تسجيل الدخول */}
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                  elevation={6}
                  sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 3,
                    background: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* رأس النموذج */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.1), mb: 3 }}>
                      <Lock sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      تسجيل الدخول
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      أدخل بياناتك للوصول إلى حسابك
                    </Typography>
                  </Box>

                  {/* رسائل الخطأ العامة */}
                  {errors.general && (
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }}
                      onClose={() => setErrors(prev => ({ ...prev, general: '' }))}
                    >
                      {errors.general}
                    </Alert>
                  )}

                  {/* نموذج تسجيل الدخول */}
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="البريد الإلكتروني"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color={errors.email ? "error" : "action"} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="كلمة المرور"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color={errors.password ? "error" : "action"} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              disabled={loading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            disabled={loading}
                            color="primary"
                          />
                        }
                        label="تذكرني"
                      />
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={handleForgotPassword}
                        disabled={loading}
                        sx={{ textDecoration: 'none' }}
                      >
                        نسيت كلمة المرور؟
                      </Link>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 20, height: 20 }}>
                            <LoadingSpinner size={20} withIcon={false} />
                          </Box>
                          جاري تسجيل الدخول...
                        </Box>
                      ) : (
                        'تسجيل الدخول'
                      )}
                    </Button>

                    {/* تسجيل الدخول عبر وسائل التواصل */}
                    <Box sx={{ mt: 4, mb: 3 }}>
                      <Divider sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          أو سجل الدخول عبر
                        </Typography>
                      </Divider>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        {[
                          { icon: <Google />, provider: 'Google', color: '#DB4437' },
                          { icon: <GitHub />, provider: 'GitHub', color: '#333' },
                          { icon: <Twitter />, provider: 'Twitter', color: '#1DA1F2' },
                        ].map((social) => (
                          <IconButton
                            key={social.provider}
                            onClick={() => handleSocialLogin(social.provider)}
                            disabled={loading}
                            sx={{
                              width: 56,
                              height: 56,
                              border: `2px solid ${alpha(social.color, 0.2)}`,
                              color: social.color,
                              '&:hover': {
                                bgcolor: alpha(social.color, 0.1),
                                borderColor: social.color,
                              }
                            }}
                          >
                            {social.icon}
                          </IconButton>
                        ))}
                      </Box>
                    </Box>

                    {/* رابط التسجيل */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        ليس لديك حساب؟{' '}
                        <Link
                          component={RouterLink}
                          to="/register"
                          variant="body2"
                          sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                        >
                          سجل الآن مجاناً
                        </Link>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* معلومات إضافية */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    بالاستمرار، فإنك توافق على{' '}
                    <Link component={RouterLink} to="/terms" variant="caption">
                      الشروط والأحكام
                    </Link>{' '}
                    و{' '}
                    <Link component={RouterLink} to="/privacy" variant="caption">
                      سياسة الخصوصية
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;