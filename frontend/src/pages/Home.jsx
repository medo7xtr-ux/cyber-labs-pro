import React, { useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Container, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Security, 
  Science, 
  School, 
  TrendingUp,
  AccessTime,
  Group,
  EmojiEvents,
  Code,
  Lock,
  Cloud,
  ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useAuth();

  // إحصائيات الموقع
  const stats = [
    { label: 'معمل تفاعلي', value: '50+', icon: <Science /> },
    { label: 'مستخدم نشط', value: '2K+', icon: <Group /> },
    { label: 'ساعة تدريب', value: '10K+', icon: <AccessTime /> },
    { label: 'معدل نجاح', value: '95%', icon: <TrendingUp /> },
  ];

  // الميزات الرئيسية
  const features = [
    {
      icon: <Security fontSize="large" />,
      title: 'بيئات آمنة',
      description: 'مختبرات معزولة تماماً لممارسة الهجمات الأخلاقية بأمان',
      color: '#1976d2'
    },
    {
      icon: <Code fontSize="large" />,
      title: 'تحديات برمجية',
      description: 'تحديات CTF وتدريبات على الثغرات البرمجية الشائعة',
      color: '#9c27b0'
    },
    {
      icon: <Lock fontSize="large" />,
      title: 'حماية متقدمة',
      description: 'تعلم تقنيات الحماية من أحدث الهجمات السيبرانية',
      color: '#2e7d32'
    },
    {
      icon: <Cloud fontSize="large" />,
      title: 'سحابة خاصة',
      description: 'بيئات افتراضية متاحة على مدار الساعة',
      color: '#ed6c02'
    },
    {
      icon: <EmojiEvents fontSize="large" />,
      title: 'منافسات وجوائز',
      description: 'مسابقات دورية وجوائز للمتفوقين',
      color: '#d32f2f'
    },
    {
      icon: <Group fontSize="large" />,
      title: 'مجتمع داعم',
      description: 'تواصل مع خبراء ومتعلمين في مجال الأمن السيبراني',
      color: '#0288d1'
    }
  ];

  // مسارات التعلم
  const learningPaths = [
    {
      title: 'مبتدئ الأمن السيبراني',
      level: 'مبتدئ',
      labs: 10,
      duration: '6 أسابيع',
      color: 'primary'
    },
    {
      title: 'أخصائي أمن الويب',
      level: 'متوسط',
      labs: 15,
      duration: '8 أسابيع',
      color: 'secondary'
    },
    {
      title: 'محترف الهاكينج الأخلاقي',
      level: 'متقدم',
      labs: 20,
      duration: '12 أسبوع',
      color: 'error'
    }
  ];

  return (
    <Box>
      {/* قسم البطل */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                أتقن الأمن السيبراني
                <br />
                <Box component="span" sx={{ color: '#42a5f5' }}>
                  في بيئة عملية آمنة
                </Box>
              </Typography>
              
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                منصة CyberLabs توفر لك تجربة تعليمية تفاعلية في مجال الأمن السيبراني 
                والاختراق الأخلاقي. ابدأ رحلتك الآن واكتسب المهارات المطلوبة في سوق العمل.
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Science />}
                  onClick={() => navigate('/labs')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  استكشف المعامل
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<School />}
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: '#e0e0e0', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  {isAuthenticated ? 'لوحة التحكم' : 'ابدأ مجاناً'}
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  textAlign: 'center'
                }}
              >
                <Security sx={{ fontSize: 300, opacity: 0.2, position: 'absolute', right: 0, top: -50 }} />
                <Box 
                  component="img"
                  src="/api/placeholder/400/300"
                  alt="Cyber Security"
                  sx={{ 
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* الإحصائيات */}
      <Container maxWidth="lg" sx={{ py: 6, mt: -4 }}>
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card sx={{ 
                textAlign: 'center',
                py: 2,
                borderRadius: 3,
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
              }}>
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* الميزات */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          لماذا تختار CyberLabs؟
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ 
                height: '100%',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-8px)' }
              }}>
                <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                  <Box sx={{ 
                    color: feature.color,
                    fontSize: 48,
                    mb: 2
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* مسارات التعلم */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
            مسارات التعلم
          </Typography>
          
          <Grid container spacing={4}>
            {learningPaths.map((path, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%',
                  border: `2px solid ${theme.palette[path.color].main}`,
                  position: 'relative'
                }}>
                  <CardContent>
                    <Chip 
                      label={path.level}
                      color={path.color}
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {path.title}
                    </Typography>
                    
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          عدد المعامل:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {path.labs}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          المدة الزمنية:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {path.duration}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      fullWidth 
                      variant="contained"
                      color={path.color}
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/labs')}
                    >
                      ابدأ المسار
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* دعوة للعمل */}
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          جاهز لبدء رحلتك في الأمن السيبراني؟
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          انضم إلى آلاف المتعلمين الذين طوروا مهاراتهم وحصلوا على وظائف في مجال الأمن السيبراني
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<School />}
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
          sx={{ 
            px: 6, 
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {isAuthenticated ? 'استمر في التعلم' : 'سجل مجاناً الآن'}
        </Button>
      </Container>
    </Box>
  );
};

export default Home;