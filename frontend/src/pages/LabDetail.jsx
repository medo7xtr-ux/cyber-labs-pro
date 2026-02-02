import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Stack,
  Chip,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import {
  Science,
  AccessTime,
  Star,
  TrendingUp,
  CheckCircle,
  PlayArrow,
  Security,
  ArrowBack
} from '@mui/icons-material';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LabDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const lab = {
    id,
    title: 'أمن تطبيقات الويب - SQL Injection',
    description: 'تعلم كيفية اكتشاف واستغلال ثغرات SQL Injection في تطبيقات الويب الحقيقية. يغطي هذا المعمل التقنيات اليدوية والآلية.',
    category: 'أمن الويب',
    difficulty: 'متوسط',
    points: 100,
    estimatedTime: '60 دقيقة',
    objectives: [
      'فهم أساسيات استعلامات SQL',
      'اكتشاف نقاط الإدخال الضعيفة',
      'استخراج البيانات من قاعدة البيانات',
      'تجاوز أنظمة المصادقة'
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/labs')}
        sx={{ mb: 4 }}
      >
        العودة للمعامل
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={lab.category} color="primary" variant="outlined" />
              <Chip label={lab.difficulty} color="warning" variant="outlined" />
            </Stack>
            <Typography variant="h3" fontWeight="800" gutterBottom>{lab.title}</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {lab.description}
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>ماذا ستتعلم؟</Typography>
          <Grid container spacing={2} sx={{ mb: 6 }}>
            {lab.objectives.map((obj, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <CheckCircle color="success" />
                  <Typography variant="body1">{obj}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            <CardContent>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>تعليمات المعمل</Typography>
              <Typography variant="body1" paragraph>
                1. قم بتشغيل البيئة الافتراضية بالضغط على زر "بدء المعمل".
              </Typography>
              <Typography variant="body1" paragraph>
                2. اتبع الخطوات الموضحة في لوحة التعليمات الجانبية.
              </Typography>
              <Typography variant="body1">
                3. ابحث عن العلم (Flag) وقم بتسليمه للحصول على النقاط.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 4 }}>تفاصيل المعمل</Typography>
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Star color="warning" />
                    <Typography>النقاط</Typography>
                  </Stack>
                  <Typography fontWeight="700">{lab.points}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTime color="info" />
                    <Typography>الوقت المقدر</Typography>
                  </Stack>
                  <Typography fontWeight="700">{lab.estimatedTime}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Security color="primary" />
                    <Typography>النوع</Typography>
                  </Stack>
                  <Typography fontWeight="700">تفاعلي</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 4 }} />
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                startIcon={<PlayArrow />}
                sx={{ py: 2, fontSize: '1.1rem' }}
              >
                بدء المعمل
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LabDetail;
