import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  IconButton,
  FormControl,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme,
  alpha,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  PersonAdd,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  CheckCircle,
  School,
  Security,
  ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { enqueueSnackbar } from 'notistack';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { register, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // المعلومات الشخصية
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    
    // كلمة المرور
    password: '',
    confirmPassword: '',
    
    // معلومات إضافية
    phone: '',
    country: 'SA',
    birthDate: '',
    
    // الاتفاقيات
    termsAccepted: false,
    newsletter: true,
    emailNotifications: true
  });

  // خطوات التسجيل
  const steps = [
    { label: 'المعلومات الشخصية', icon: <Person /> },
    { label: 'الحساب والأمان', icon: <Lock /> },
    { label: 'التفضيلات', icon: <School /> },
    { label: 'المراجعة', icon: <CheckCircle /> }
  ];

  // تحقق من صحة الخطوة الأولى
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'الاسم الأول قصير جداً';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'اسم العائلة مطلوب';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'اسم العائلة قصير جداً';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    } else if (formData.username.length < 3) {
      newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'اسم المستخدم يمكن أن يحتوي على أحرف إنجليزية وأرقام وشرطة سفلية فقط';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // تحقق من صحة الخطوة الثانية
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'يجب أن تحتوي على حرف كبير وصغير ورقم';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // تحقق من صحة الخطوة الثالثة
  const validateStep3 = () => {
    const newErrors = {};
    
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح';
    }
    
    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const minAge = 13;
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < minAge) {
        newErrors.birthDate = `يجب أن يكون عمرك ${minAge} سنة على الأقل`;
      }
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'يجب الموافقة على الشروط والأحكام';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تغيير المدخلات
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

  // الانتقال للخطوة التالية
  const handleNext = () => {
    let isValid = false;
    
    switch (step) {
      case 0:
        isValid = validateStep1();
        break;
      case 1:
        isValid = validateStep2();
        break;
      case 2:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  // الانتقال للخطوة السابقة
  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step !== 3) {
      handleNext();
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      // إعداد بيانات التسجيل
      const registrationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        phone: formData.phone || undefined,
        country: formData.country,
        birth_date: formData.birthDate || undefined,
        newsletter: formData.newsletter,
        email_notifications: formData.emailNotifications
      };

      const result = await register(registrationData);
      
      if (result.success) {
        enqueueSnackbar('🎉 تم إنشاء حسابك بنجاح!', {
          variant: 'success',
          autoHideDuration: 5000
        });
        
        // التوجيه إلى لوحة التحكم أو صفحة التحقق
        if (result.requires_verification) {
          navigate('/verify-email', { 
            state: { email: formData.email } 
          });
        } else {
          setTimeout(() => navigate('/dashboard'), 1000);
        }
        
      } else {
        // معالجة أخطاء التسجيل
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى' });
    } finally {
      setLoading(false);
    }
  };

  // محتوى الخطوات
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="الاسم الأول"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.firstName ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="اسم العائلة"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email || 'سيتم استخدامه للتواصل واستعادة الحساب'}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color={errors.email ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="اسم المستخدم"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username || 'سيتم استخدامه لتسجيل الدخول وعرضه في الملف الشخصي'}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.username ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="كلمة المرور"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || 'يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير وصغير ورقم'}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={errors.password ? "error" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={errors.confirmPassword ? "error" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>نصائح لأمان أفضل:</strong>
                  <br />
                  • استخدم كلمة مرور فريدة لا تستخدمها في مواقع أخرى
                  <br />
                  • تجنب استخدام المعلومات الشخصية
                  <br />
                  • استخدم مزيجاً من الأحرف والأرقام والرموز
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="رقم الهاتف (اختياري)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={loading}
                placeholder="+966 5X XXX XXXX"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="تاريخ الميلاد (اختياري)"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                error={!!errors.birthDate}
                helperText={errors.birthDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl error={!!errors.termsAccepted} component="fieldset">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      أوافق على{' '}
                      <Link component={RouterLink} to="/terms" target="_blank">
                        الشروط والأحكام
                      </Link>{' '}
                      و{' '}
                      <Link component={RouterLink} to="/privacy" target="_blank">
                        سياسة الخصوصية
                      </Link>
                    </Typography>
                  }
                />
                {errors.termsAccepted && (
                  <FormHelperText>{errors.termsAccepted}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    disabled={loading}
                    color="primary"
                  />
                }
                label="أرغب في تلقي النشرة الإخبارية والعروض الخاصة"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    disabled={loading}
                    color="primary"
                  />
                }
                label="تفعيل الإشعارات عبر البريد الإلكتروني"
              />
            </Grid>
          </Grid>
        );
      
      case 3:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                راجع معلوماتك قبل إنشاء الحساب. يمكنك تعديل أي معلومات بالنقر على زر "السابق".
              </Typography>
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  المعلومات الشخصية
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        الاسم الكامل:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {formData.firstName} {formData.lastName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        البريد الإلكتروني:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {formData.email}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        اسم المستخدم:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {formData.username}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  التفضيلات
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2">
                    {formData.newsletter ? '✅' : '❌'} النشرة الإخبارية
                  </Typography>
                  <Typography variant="body2">
                    {formData.emailNotifications ? '✅' : '❌'} الإشعارات البريدية
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                بالنقر على "إنشاء حساب"، فإنك توافق على جميع الشروط والأحكام.
              </Typography>
            </Alert>
          </Box>
        );
      
      default:
        return 'خطوة غير معروفة';
    }
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
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box>
            {/* زر العودة */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ mb: 3 }}
            >
              العودة للرئيسية
            </Button>

            <Paper
              elevation={6}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              {/* رأس الصفحة */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1), 
                  mb: 3 
                }}>
                  <PersonAdd sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  انضم إلى CyberLabs
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ابدأ رحلتك في عالم الأمن السيبراني
                </Typography>
              </Box>

              {/* رسائل الأخطاء العامة */}
              {errors.general && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setErrors(prev => ({ ...prev, general: '' }))}
                >
                  {errors.general}
                </Alert>
              )}

              {/* شريط التقدم */}
              <Stepper 
                activeStep={step} 
                orientation="horizontal"
                sx={{ 
                  mb: 5,
                  '& .MuiStepLabel-label': {
                    fontWeight: 'bold'
                  }
                }}
              >
                {steps.map((stepItem, index) => (
                  <Step key={index} completed={step > index}>
                    <StepLabel icon={stepItem.icon}>
                      {stepItem.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* محتوى الخطوة */}
              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ mb: 4 }}>
                  {getStepContent(step)}
                </Box>

                {/* أزرار التنقل */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    disabled={step === 0 || loading}
                    onClick={handleBack}
                    sx={{ 
                      visibility: step === 0 ? 'hidden' : 'visible',
                      minWidth: 120
                    }}
                  >
                    السابق
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    endIcon={step === 3 ? <PersonAdd /> : <ArrowForward />}
                    sx={{ 
                      minWidth: 160,
                      fontWeight: 'bold',
                      py: 1.5
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        {step === 3 ? 'جاري الإنشاء...' : 'جارٍ...'}
                      </Box>
                    ) : step === 3 ? (
                      'إنشاء الحساب'
                    ) : (
                      'التالي'
                    )}
                  </Button>
                </Box>
              </Box>

              {/* فوتر التسجيل */}
              <Divider sx={{ my: 4 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  لديك حساب بالفعل؟{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    sx={{ fontWeight: 'bold', textDecoration: 'none' }}
                  >
                    سجل الدخول الآن
                  </Link>
                </Typography>
                
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
            </Paper>

            {/* مزايا المنصة */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {[
                { icon: <Security />, title: 'تعلم آمن', desc: 'بيئات معزولة لممارسة الأمن السيبراني' },
                { icon: <School />, title: 'شهادات معتمدة', desc: 'احصل على شهادات تثبت مهاراتك' },
                { icon: <Person />, title: 'مجتمع داعم', desc: 'انضم إلى آلاف المتعلمين والمتخصصين' }
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Box sx={{ color: 'primary.main', fontSize: 40, mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;