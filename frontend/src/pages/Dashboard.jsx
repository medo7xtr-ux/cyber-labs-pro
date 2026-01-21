import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Divider,
  Chip,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person,
  Science,
  Assessment,
  TrendingUp,
  ArrowForward,
  EmojiEvents,
  AccessTime,
  Speed,
  Star,
  CalendarToday,
  BarChart,
  Timeline,
  Security,
  Whatshot
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// مكونات فرعية
const StatCard = ({ title, value, icon, color, progress, subText }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          {subText && (
            <Typography variant="caption" color="text.secondary">
              {subText}
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          bgcolor: alpha(color || '#1976d2', 0.1),
          borderRadius: 2,
          p: 1,
          color: color || '#1976d2'
        }}>
          {icon}
        </Box>
      </Box>
      {progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: alpha(color || '#1976d2', 0.2),
              '& .MuiLinearProgress-bar': {
                bgcolor: color || '#1976d2'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              التقدم
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {progress}%
            </Typography>
          </Box>
        </Box>
      )}
    </CardContent>
  </Card>
);

const LabProgressCard = ({ lab }) => {
  const navigate = useNavigate();
  const getColor = (difficulty) => {
    switch(difficulty) {
      case 'مبتدئ': return 'success';
      case 'متوسط': return 'warning';
      case 'متقدم': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {lab.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {lab.category}
            </Typography>
          </Box>
          <Chip 
            label={lab.difficulty} 
            size="small" 
            color={getColor(lab.difficulty)}
            sx={{ height: 24 }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              التقدم
            </Typography>
            <Typography variant="caption" fontWeight="bold">
              {lab.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={lab.progress}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: alpha(getColor(lab.difficulty) === 'success' ? '#4caf50' : 
                          getColor(lab.difficulty) === 'warning' ? '#ff9800' : '#f44336', 0.2),
              '& .MuiLinearProgress-bar': {
                bgcolor: getColor(lab.difficulty) === 'success' ? '#4caf50' : 
                         getColor(lab.difficulty) === 'warning' ? '#ff9800' : '#f44336'
              }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            <AccessTime sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
            {lab.timeSpent}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/labs/${lab.id}`)}
            sx={{ minWidth: 100 }}
          >
            {lab.progress === 100 ? 'مراجعة' : 'استكمل'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const AchievementCard = ({ achievement }) => (
  <Card sx={{ 
    background: `linear-gradient(135deg, ${achievement.color}20 0%, ${achievement.color}10 100%)`,
    border: `1px solid ${achievement.color}30`
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: achievement.color, width: 50, height: 50 }}>
          {achievement.icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {achievement.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {achievement.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <CalendarToday sx={{ fontSize: 12 }} />
            <Typography variant="caption">
              {achievement.date}
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // محاكاة جلب البيانات من API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // في التطبيق الحقيقي، سيكون هنا استدعاء API
      
      // بيانات تجريبية محسنة
      const mockData = {
        stats: {
          totalLabs: 42,
          completedLabs: 12,
          totalPoints: 2450,
          accuracy: 87,
          streakDays: 14,
          rank: 45,
          weeklyProgress: 65,
          timeSpent: '48h 30m'
        },
        recentLabs: [
          { 
            id: 1, 
            title: 'أمن تطبيقات الويب - SQL Injection', 
            progress: 100, 
            difficulty: 'متوسط',
            category: 'أمن الويب',
            timeSpent: '3h 15m'
          },
          { 
            id: 2, 
            title: 'تحليل البرمجيات الخبيثة', 
            progress: 75, 
            difficulty: 'متقدم',
            category: 'تحليل البرمجيات',
            timeSpent: '6h 45m'
          },
          { 
            id: 3, 
            title: 'تشفير البيانات المتقدم', 
            progress: 30, 
            difficulty: 'متوسط',
            category: 'التشفير',
            timeSpent: '2h 10m'
          },
          { 
            id: 4, 
            title: 'اختبار اختراق الشبكات', 
            progress: 45, 
            difficulty: 'متوسط',
            category: 'أمن الشبكات',
            timeSpent: '4h 20m'
          },
        ],
        achievements: [
          {
            title: 'مبتدئ الأمن السيبراني',
            description: 'أكمل 5 معامل للمبتدئين',
            icon: <Security />,
            color: theme.palette.primary.main,
            date: '2024-01-15'
          },
          {
            title: 'متخصص أمن الويب',
            description: 'أكمل جميع معامل أمن الويب',
            icon: <Whatshot />,
            color: theme.palette.error.main,
            date: '2024-02-10'
          },
          {
            title: 'محلل ماهر',
            description: 'حقق دقة فوق 90% في 10 معامل',
            icon: <BarChart />,
            color: theme.palette.success.main,
            date: '2024-02-20'
          },
          {
            title: 'التزام الأسبوعين',
            description: 'تصفح المنصة لمدة 14 يوم متتالي',
            icon: <Timeline />,
            color: theme.palette.warning.main,
            date: '2024-02-22'
          },
        ],
        leaderboard: [
          { rank: 1, name: 'أحمد محمد', points: 5800 },
          { rank: 2, name: 'سارة خالد', points: 5250 },
          { rank: 3, name: 'محمد علي', points: 4920 },
          { rank: 4, name: 'فاطمة حسن', points: 4650 },
          { rank: 5, name: 'خالد إبراهيم', points: 4320 },
        ]
      };
      
      setTimeout(() => {
        setDashboardData(mockData);
        setLoading(false);
      }, 500);
    };

    fetchDashboardData();
  }, [theme.palette]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading || !dashboardData) {
    return <LoadingSpinner fullScreen />;
  }

  const { stats, recentLabs, achievements, leaderboard } = dashboardData;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* رأس لوحة التحكم */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              <Person sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
              لوحة التحكم
            </Typography>
            <Typography variant="h6" color="text.secondary">
              مرحباً بعودتك، <Box component="span" fontWeight="bold" color="primary.main">{user?.name || user?.username || 'المستخدم'}</Box>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Star />}
              label={`الترتيب: #${stats.rank}`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              icon={<Whatshot />}
              label={`${stats.streakDays} يوم متتالي`}
              color="warning"
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<Science />}
              onClick={() => navigate('/labs')}
              sx={{ minWidth: 140 }}
            >
              معمل جديد
            </Button>
          </Box>
        </Box>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            mt: 3,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none',
              fontSize: '1rem'
            }
          }}
        >
          <Tab icon={<Timeline />} iconPosition="start" label="نظرة عامة" />
          <Tab icon={<Science />} iconPosition="start" label="المعامل" />
          <Tab icon={<EmojiEvents />} iconPosition="start" label="الإنجازات" />
          <Tab icon={<BarChart />} iconPosition="start" label="التقارير" />
        </Tabs>
      </Box>

      {/* محتوى التبويب النظرة العامة */}
      {activeTab === 0 && (
        <>
          {/* إحصائيات سريعة */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="إجمالي المعامل"
                value={stats.totalLabs}
                icon={<Science />}
                color={theme.palette.primary.main}
                progress={(stats.completedLabs / stats.totalLabs) * 100}
                subText={`${stats.completedLabs} مكتمل`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="النقاط الإجمالية"
                value={stats.totalPoints.toLocaleString()}
                icon={<TrendingUp />}
                color={theme.palette.success.main}
                subText="+320 هذا الأسبوع"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="معدل الدقة"
                value={`${stats.accuracy}%`}
                icon={<Speed />}
                color={theme.palette.warning.main}
                progress={stats.accuracy}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="الوقت المستثمر"
                value={stats.timeSpent}
                icon={<AccessTime />}
                color={theme.palette.info.main}
                progress={stats.weeklyProgress}
                subText={`${stats.weeklyProgress}% هذا الأسبوع`}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* المعامل الحديثة */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      المعامل الحديثة
                    </Typography>
                    <Button
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/labs')}
                      size="small"
                    >
                      عرض الكل
                    </Button>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
                    {recentLabs.map((lab) => (
                      <LabProgressCard key={lab.id} lab={lab} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* الجانب الأيمن */}
            <Grid item xs={12} lg={4}>
              {/* الإنجازات */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEvents /> الإنجازات
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={2}>
                    {achievements.slice(0, 3).map((achievement, index) => (
                      <AchievementCard key={index} achievement={achievement} />
                    ))}
                    
                    {achievements.length > 3 && (
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => setActiveTab(2)}
                        sx={{ mt: 1 }}
                      >
                        عرض جميع الإنجازات ({achievements.length})
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* المتصدرون */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp /> المتصدرون
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Stack spacing={2}>
                    {leaderboard.map((player, index) => (
                      <Box 
                        key={player.rank}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: index === 0 ? alpha(theme.palette.warning.main, 0.1) : 
                                   index === 1 ? alpha(theme.palette.grey[500], 0.1) :
                                   index === 2 ? alpha(theme.palette.error.main, 0.05) : 'transparent',
                          border: index < 3 ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none'
                        }}
                      >
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: index === 0 ? 'warning.main' : 
                                   index === 1 ? 'grey.500' :
                                   index === 2 ? 'error.main' : 'primary.main',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {player.rank}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {player.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {player.points.toLocaleString()} نقطة
                          </Typography>
                        </Box>
                        <Chip 
                          label={index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                          size="small"
                          sx={{ visibility: index < 3 ? 'visible' : 'hidden' }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* محتوى التبويب المعامل */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              جميع المعامل
            </Typography>
            <Typography color="text.secondary" paragraph>
              استكشف معامل الأمن السيبراني التفاعلية
            </Typography>
          </Grid>
          {/* سيتم إضافة قائمة المعامل هنا */}
        </Grid>
      )}

      {/* محتوى التبويب الإنجازات */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              جميع الإنجازات
            </Typography>
            <Typography color="text.secondary" paragraph>
              شاهد إنجازاتك وشاركها مع الآخرين
            </Typography>
          </Grid>
          {achievements.map((achievement, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AchievementCard achievement={achievement} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* محتوى التبويب التقارير */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              التقارير والإحصائيات
            </Typography>
            <Typography color="text.secondary" paragraph>
              تحليل أدائك وتقدمك في المنصة
            </Typography>
          </Grid>
          {/* سيتم إضافة المخططات والإحصائيات التفصيلية هنا */}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;