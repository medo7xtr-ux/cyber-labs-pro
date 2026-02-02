import React from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Container, 
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  alpha
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
  const { isAuthenticated } = useAuth();

  const stats = [
    { label: 'معمل تفاعلي', value: '50+', icon: <Science /> },
    { label: 'مستخدم نشط', value: '2K+', icon: <Group /> },
    { label: 'ساعة تدريب', value: '10K+', icon: <AccessTime /> },
    { label: 'معدل نجاح', value: '95%', icon: <TrendingUp /> },
  ];

  const features = [
    { icon: <Security />, title: 'بيئات آمنة', description: 'مختبرات معزولة تماماً لممارسة الهجمات الأخلاقية بأمان', color: theme.palette.primary.main },
    { icon: <Code />, title: 'تحديات برمجية', description: 'تحديات CTF وتدريبات على الثغرات البرمجية الشائعة', color: theme.palette.secondary.main },
    { icon: <Lock />, title: 'حماية متقدمة', description: 'تعلم تقنيات الحماية من أحدث الهجمات السيبرانية', color: theme.palette.success.main },
    { icon: <Cloud />, title: 'سحابة خاصة', description: 'بيئات افتراضية متاحة على مدار الساعة', color: theme.palette.warning.main },
    { icon: <EmojiEvents />, title: 'منافسات وجوائز', description: 'مسابقات دورية وجوائز للمتفوقين', color: theme.palette.error.main },
    { icon: <Group />, title: 'مجتمع داعم', description: 'تواصل مع خبراء ومتعلمين في مجال الأمن السيبراني', color: theme.palette.info.main }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          pt: { xs: 10, md: 20 },
          pb: { xs: 10, md: 15 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    mb: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  أتقن الأمن السيبراني
                </Typography>
                <Typography variant="h4" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
                  في بيئة عملية تفاعلية واحترافية
                </Typography>
                <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', fontSize: '1.1rem', maxWidth: 600, ml: { md: 'auto' } }}>
                  منصة CyberLabs توفر لك تجربة تعليمية فريدة في مجال الاختراق الأخلاقي. ابدأ رحلتك الآن واكتسب المهارات المطلوبة في سوق العمل العالمي.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row-reverse' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/labs')}
                    sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
                  >
                    استكشف المعامل
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                    sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
                  >
                    {isAuthenticated ? 'لوحة التحكم' : 'ابدأ مجاناً'}
                  </Button>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: '100%',
                    height: '100%',
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    borderRadius: 10,
                    zIndex: 0
                  }
                }}
              >
                <Box 
                  component="img"
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                  alt="Cyber Security"
                  sx={{ 
                    width: '100%',
                    borderRadius: 10,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2, '& svg': { fontSize: 40 } }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.subtle', py: 15 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h2" sx={{ mb: 3 }}>لماذا تختار CyberLabs؟</Typography>
            <Typography variant="h6" color="text.secondary">نحن نوفر لك كل ما تحتاجه لتصبح محترفاً في الأمن السيبراني</Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', p: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      bgcolor: alpha(feature.color, 0.1), 
                      color: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                      '& svg': { fontSize: 40 }
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 15, textAlign: 'center' }}>
        <Card sx={{ 
          p: { xs: 4, md: 8 }, 
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white'
        }}>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 800 }}>
            جاهز لبدء رحلتك الاحترافية؟
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.9 }}>
            انضم الآن إلى مجتمعنا وابدأ في تطوير مهاراتك في بيئة عملية حقيقية.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ 
              bgcolor: 'white', 
              color: 'primary.main',
              px: 8,
              py: 2,
              fontSize: '1.2rem',
              '&:hover': { bgcolor: alpha('#ffffff', 0.9) }
            }}
          >
            سجل مجاناً الآن
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default Home;
