import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  useTheme,
  alpha,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search,
  Science,
  TrendingUp,
  AccessTime,
  Star,
  Lock
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Labs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const labs = [
    { id: 1, title: 'أمن تطبيقات الويب - SQL Injection', category: 'أمن الويب', difficulty: 'متوسط', points: 100, time: '60 دقيقة', isPremium: false },
    { id: 2, title: 'تحليل البرمجيات الخبيثة', category: 'تحليل البرمجيات', difficulty: 'متقدم', points: 250, time: '120 دقيقة', isPremium: true },
    { id: 3, title: 'اختبار اختراق الشبكات', category: 'أمن الشبكات', difficulty: 'متوسط', points: 150, time: '90 دقيقة', isPremium: false },
    { id: 4, title: 'أساسيات التشفير', category: 'التشفير', difficulty: 'مبتدئ', points: 50, time: '30 دقيقة', isPremium: false },
    { id: 5, title: 'الهندسة العكسية', category: 'الهندسة العكسية', difficulty: 'خبير', points: 500, time: '180 دقيقة', isPremium: true },
    { id: 6, title: 'التحقيق الجنائي الرقمي', category: 'التحقيق الجنائي', difficulty: 'متقدم', points: 300, time: '150 دقيقة', isPremium: true },
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight="800" gutterBottom>استكشف المعامل</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>طور مهاراتك العملية في بيئات اختبار حقيقية</Typography>
        
        <TextField
          fullWidth
          placeholder="ابحث عن معمل معين..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 600, mx: 'auto' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {labs.map((lab) => (
          <Grid item xs={12} sm={6} md={4} key={lab.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ 
                height: 140, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Science sx={{ fontSize: 60, color: alpha(theme.palette.primary.main, 0.2) }} />
                {lab.isPremium && (
                  <Chip 
                    icon={<Star sx={{ fontSize: '14px !important' }} />} 
                    label="مميز" 
                    size="small" 
                    color="warning" 
                    sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 700 }} 
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={lab.category} size="small" variant="outlined" />
                  <Chip 
                    label={lab.difficulty} 
                    size="small" 
                    color={lab.difficulty === 'مبتدئ' ? 'success' : lab.difficulty === 'متوسط' ? 'warning' : 'error'} 
                    variant="outlined" 
                  />
                </Stack>
                <Typography variant="h6" fontWeight="700" gutterBottom sx={{ height: '2.8em', overflow: 'hidden' }}>
                  {lab.title}
                </Typography>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, color: 'text.secondary' }}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUp fontSize="small" />
                    <Typography variant="caption">{lab.points} نقطة</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTime fontSize="small" />
                    <Typography variant="caption">{lab.time}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
              <Box sx={{ p: 3, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant={lab.isPremium ? "outlined" : "contained"} 
                  onClick={() => navigate(`/labs/${lab.id}`)}
                  startIcon={lab.isPremium ? <Lock /> : null}
                >
                  {lab.isPremium ? 'فتح المعمل' : 'ابدأ الآن'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Labs;
