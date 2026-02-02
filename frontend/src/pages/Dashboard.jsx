import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Science,
  EmojiEvents,
  TrendingUp,
  AccessTime,
  Security,
  Whatshot,
  ArrowForward,
  NotificationsActive,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StatCard = ({ title, value, icon, color, progress }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Box>
          <Typography color="text.secondary" variant="subtitle2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="800">
            {value}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 3, 
          bgcolor: alpha(color, 0.1), 
          color: color,
          '& svg': { fontSize: 32 }
        }}>
          {icon}
        </Box>
      </Stack>
      {progress !== undefined && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">معدل الإنجاز</Typography>
            <Typography variant="caption" fontWeight="700">{progress}%</Typography>
          </Stack>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 6, borderRadius: 3, bgcolor: alpha(color, 0.1), '& .MuiLinearProgress-bar': { bgcolor: color } }}
          />
        </Box>
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Container maxWidth="lg" sx={{ py: 12 }}>
      <Box sx={{ mb: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" fontWeight="800" gutterBottom>
              لوحة التحكم
            </Typography>
            <Typography variant="h6" color="text.secondary">
              مرحباً بك مجدداً، {user?.username || 'البطل'}! إليك ملخص تقدمك اليوم.
            </Typography>
          </Box>
          <Avatar 
            src={user?.avatar} 
            sx={{ width: 80, height: 80, border: `4px solid ${theme.palette.primary.main}` }}
          >
            {user?.username?.charAt(0)}
          </Avatar>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="المعامل المكتملة" value="12" icon={<Science />} color={theme.palette.primary.main} progress={65} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="إجمالي النقاط" value="2,450" icon={<EmojiEvents />} color={theme.palette.warning.main} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="دقة الحلول" value="87%" icon={<TrendingUp />} color={theme.palette.success.main} progress={87} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="ساعات التدريب" value="48" icon={<AccessTime />} color={theme.palette.secondary.main} />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>المعامل الأخيرة</Typography>
          <Stack spacing={2}>
            {[
              { title: 'أمن تطبيقات الويب - SQL Injection', category: 'أمن الويب', progress: 100, difficulty: 'متوسط' },
              { title: 'تحليل البرمجيات الخبيثة', category: 'تحليل البرمجيات', progress: 75, difficulty: 'متقدم' },
              { title: 'اختبار اختراق الشبكات', category: 'أمن الشبكات', progress: 45, difficulty: 'متوسط' },
            ].map((lab, i) => (
              <Card key={i} sx={{ p: 1, transition: '0.3s', '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="subtitle1" fontWeight="700">{lab.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{lab.category} • {lab.difficulty}</Typography>
                    </Box>
                    <Button variant="outlined" size="small" endIcon={<ArrowForward />}>
                      {lab.progress === 100 ? 'مراجعة' : 'استكمال'}
                    </Button>
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress variant="determinate" value={lab.progress} sx={{ height: 4, borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>الإشعارات الأخيرة</Typography>
          <Card sx={{ mb: 4 }}>
            <List sx={{ p: 0 }}>
              {[
                { title: 'تم إكمال المعمل بنجاح', time: 'منذ ساعتين', icon: <CheckCircle color="success" /> },
                { title: 'تحدي جديد متاح الآن', time: 'منذ 5 ساعات', icon: <NotificationsActive color="primary" /> },
                { title: 'لقد حصلت على وسام جديد', time: 'منذ يوم', icon: <EmojiEvents color="warning" /> },
              ].map((notif, i) => (
                <React.Fragment key={i}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'transparent' }}>{notif.icon}</Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={notif.title} 
                      secondary={notif.time}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItem>
                  {i < 2 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Card>

          <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>الإنجازات</Typography>
          <Stack spacing={2}>
            {[
              { title: 'مبتدئ الأمن', icon: <Security />, color: theme.palette.primary.main },
              { title: 'صائد الثغرات', icon: <Whatshot />, color: theme.palette.error.main },
            ].map((ach, i) => (
              <Card key={i} sx={{ bgcolor: alpha(ach.color, 0.05), border: `1px solid ${alpha(ach.color, 0.1)}` }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: ach.color }}>{ach.icon}</Avatar>
                    <Typography variant="subtitle1" fontWeight="700">{ach.title}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
