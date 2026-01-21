import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Grid,
  Tab,
  Tabs,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Breadcrumbs,
  Link,
  useTheme,
  alpha,
  Paper,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Science,
  AccessTime,
  Star,
  TrendingUp,
  Person,
  Lock,
  LockOpen,
  Download,
  Share,
  Bookmark,
  BookmarkBorder,
  PlayArrow,
  CheckCircle,
  Warning,
  Info,
  Code,
  Security,
  School,
  Timeline,
  EmojiEvents,
  Language
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as labsService from '../services/labs';
import { getCategoryInfo, getDifficultyInfo, getLabStatusInfo } from '../config/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

// مكونات التبويبات
const OverviewTab = ({ lab }) => {
  const categoryInfo = getCategoryInfo(lab.category);
  const difficultyInfo = getDifficultyInfo(lab.difficulty);

  return (
    <Box>
      {/* نظرة عامة */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            نظرة عامة
          </Typography>
          <Typography paragraph>
            {lab.overview || lab.description || 'لا يوجد وصف مفصل لهذا المعمل.'}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* معلومات المعمل */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                معلومات المعمل
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Science color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      التصنيف
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {categoryInfo.ar}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TrendingUp color="warning" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      الصعوبة
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {difficultyInfo.ar}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccessTime color="info" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      الوقت المقدر
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lab.estimated_time} دقيقة
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Star color="secondary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      النقاط
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {lab.points} نقطة
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* المتطلبات */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                المتطلبات
              </Typography>
              
              {lab.prerequisites && lab.prerequisites.length > 0 ? (
                <Stack spacing={2}>
                  {lab.prerequisites.map((prereq, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CheckCircle color="success" />
                      <Typography variant="body1">
                        {prereq}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  لا توجد متطلبات مسبقة لهذا المعمل.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                الوسوم
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {lab.tags && lab.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const ChallengesTab = ({ lab, userProgress, onStartLab }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const result = await labsService.getLabChallenges(lab.id);
        if (result.success) {
          setChallenges(result.challenges);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [lab.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* رأس التحديات */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          التحديات ({challenges.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          أكمل جميع التحديات لإكمال المعمل والحصول على الشهادة
        </Typography>
      </Box>

      {/* قائمة التحديات */}
      {challenges.length === 0 ? (
        <Alert severity="info">
          لا توجد تحديات متاحة لهذا المعمل حالياً.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {challenges.map((challenge, index) => (
            <Card key={challenge.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      {index + 1}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {challenge.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {challenge.description?.substring(0, 100)}...
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={`${challenge.points} نقطة`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {challenge.user_submission ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="مكتمل"
                        color="success"
                        variant="filled"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="لم يكتمل"
                        color="default"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {challenge.difficulty_info?.ar}
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    onClick={onStartLab}
                    disabled={!userProgress?.started}
                  >
                    {challenge.user_submission ? 'عرض الحل' : 'حل التحدي'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

const StatisticsTab = ({ lab, statistics }) => {
  if (!statistics) {
    return (
      <Alert severity="info">
        لا توجد إحصائيات متاحة لهذا المعمل حالياً.
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* إحصائيات عامة */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                إحصائيات عامة
              </Typography>
              
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      معدل الإكمال
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {statistics.completion_rate || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.completion_rate || 0} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      متوسط النقاط
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {statistics.average_score || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={statistics.average_score || 0} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      متوسط الوقت
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {statistics.average_time || 0} دقيقة
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* إحصائيات المستخدمين */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                نشاط المستخدمين
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    المشاهدات
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {lab.views || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    الإكمالات
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {lab.completions || 0}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    المشاركون النشطون
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {statistics.active_users || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const LabDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated, isPremium, user } = useAuth();

  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [statistics, setStatistics] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userProgress, setUserProgress] = useState(null);

  // تحميل بيانات المعمل
  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);
        
        // تحميل بيانات المعمل
        const labResult = await labsService.getLabById(id);
        
        if (labResult.success) {
          setLab(labResult.lab);
          setUserProgress(labResult.lab.user_progress);
          
          // تحميل الإحصائيات
          const statsResult = await labsService.getLabStatistics(id);
          if (statsResult.success) {
            setStatistics(statsResult.statistics);
          }
        } else {
          setError(labResult.message || 'فشل في تحميل المعمل');
        }
      } catch (err) {
        console.error('Error fetching lab:', err);
        setError('حدث خطأ في تحميل المعمل');
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, [id]);

  // بدء المعمل
  const handleStartLab = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/labs/${id}` } });
      return;
    }

    if (lab.is_premium && !isPremium) {
      navigate('/subscription');
      return;
    }

    try {
      const result = await labsService.startLab(id);
      if (result.success) {
        navigate(`/labs/${id}/challenge`);
      }
    } catch (err) {
      console.error('Error starting lab:', err);
    }
  };

  // تبديل الإشارة المرجعية
  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: تنفيذ حفظ/حذف من الإشارات المرجعية في API
  };

  // مشاركة المعمل
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lab.title,
          text: lab.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // نسخ الرابط
      navigator.clipboard.writeText(window.location.href);
      // TODO: إظهار إشعار بنجاح النسخ
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen type="science" message="جاري تحميل المعمل..." />;
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/labs')}
          variant="contained"
        >
          العودة للمعامل
        </Button>
      </Container>
    );
  }

  if (!lab) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="info">
          لم يتم العثور على المعمل المطلوب
        </Alert>
      </Container>
    );
  }

  const categoryInfo = getCategoryInfo(lab.category);
  const difficultyInfo = getDifficultyInfo(lab.difficulty);
  const statusInfo = getLabStatusInfo(userProgress?.status || 'NOT_STARTED');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* شريط التنقل */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Breadcrumbs sx={{ py: 2 }}>
            <Link
              component={RouterLink}
              to="/labs"
              color="inherit"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <ArrowBack sx={{ fontSize: 16 }} />
              المعامل
            </Link>
            <Typography color="text.primary">
              {lab.title}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* المحتوى الرئيسي */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* رأس المعمل */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ overflow: 'visible' }}>
              <CardContent sx={{ position: 'relative' }}>
                {/* شارة المعمل المميز */}
                {lab.is_premium && (
                  <Chip
                    icon={<Star />}
                    label="معمل مميز"
                    color="warning"
                    sx={{
                      position: 'absolute',
                      top: -16,
                      left: 16,
                      fontWeight: 'bold'
                    }}
                  />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {lab.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        icon={<Science />}
                        label={categoryInfo.ar}
                        sx={{ 
                          bgcolor: alpha(categoryInfo.color, 0.1),
                          color: categoryInfo.color,
                          fontWeight: 'medium'
                        }}
                      />
                      <Chip
                        label={difficultyInfo.ar}
                        sx={{ 
                          bgcolor: alpha(difficultyInfo.color, 0.1),
                          color: difficultyInfo.color,
                          fontWeight: 'medium'
                        }}
                      />
                      {lab.tags && lab.tags.slice(0, 2).map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>

                    <Typography variant="body1" color="text.secondary" paragraph>
                      {lab.description}
                    </Typography>
                  </Box>

                  {/* الإجراءات السريعة */}
                  <Stack direction="row" spacing={1}>
                    <Tooltip title={isBookmarked ? "إزالة من الإشارات المرجعية" : "إضافة للإشارات المرجعية"}>
                      <IconButton onClick={handleToggleBookmark}>
                        {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="مشاركة">
                      <IconButton onClick={handleShare}>
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                {/* شريط التقدم */}
                {userProgress && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        تقدمك في المعمل
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {userProgress.progress || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={userProgress.progress || 0} 
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }}
                    />
                  </Box>
                )}

                {/* معلومات سريعة */}
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h5" color="primary" fontWeight="bold">
                        {lab.points}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        نقاط
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {lab.estimated_time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        دقيقة
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {lab.challenge_count || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        تحدي
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {lab.completions || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        إكمال
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  إبدأ الآن
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {lab.is_premium && !isPremium ? (
                      <Lock color="warning" />
                    ) : (
                      <LockOpen color="success" />
                    )}
                    <Typography variant="body2">
                      {lab.is_premium && !isPremium 
                        ? 'يتطلب اشتراك مميز' 
                        : 'متاح للوصول'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AccessTime color="info" />
                    <Typography variant="body2">
                      الوقت المقدر: {lab.estimated_time} دقيقة
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Person color="primary" />
                    <Typography variant="body2">
                      {lab.required_level || 'جميع المستويات'}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={userProgress?.started ? <PlayArrow /> : <Science />}
                  onClick={handleStartLab}
                  disabled={lab.is_premium && !isPremium}
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    mb: 2
                  }}
                >
                  {userProgress?.started ? 'استكمل المعمل' : 'بدء المعمل الآن'}
                </Button>

                {lab.is_premium && !isPremium && (
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/subscription')}
                    sx={{ mb: 2 }}
                  >
                    اشترك الآن للوصول
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  بعد الإكمال ستحصل على:
                </Typography>

                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEvents color="warning" />
                    <Typography variant="body2">
                      {lab.points} نقطة
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <School color="primary" />
                    <Typography variant="body2">
                      شهادة إكمال
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline color="success" />
                    <Typography variant="body2">
                      تقدم في مسار التعلم
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* تبويبات المحتوى */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Info />} label="نظرة عامة" />
              <Tab icon={<Code />} label="التحديات" />
              <Tab icon={<Timeline />} label="الإحصائيات" />
              <Tab icon={<Security />} label="الموارد" />
              <Tab icon={<Language />} label="المناقشات" />
            </Tabs>
          </Box>

          <CardContent>
            {activeTab === 0 && <OverviewTab lab={lab} />}
            {activeTab === 1 && (
              <ChallengesTab 
                lab={lab} 
                userProgress={userProgress}
                onStartLab={handleStartLab}
              />
            )}
            {activeTab === 2 && <StatisticsTab lab={lab} statistics={statistics} />}
            {activeTab === 3 && (
              <Alert severity="info">
                قسم الموارد قيد التطوير
              </Alert>
            )}
            {activeTab === 4 && (
              <Alert severity="info">
                قسم المناقشات قيد التطوير
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* نصائح وإرشادات */}
        {userProgress?.status === 'IN_PROGRESS' && (
          <Fade in>
            <Alert 
              severity="info" 
              icon={<Warning />}
              sx={{ mt: 3 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                أنت في منتصف هذا المعمل
              </Typography>
              <Typography variant="body2">
                لديك {userProgress.challenges_completed || 0} من أصل {lab.challenge_count || 0} تحدٍ مكتمل.
                استمر في التقدم لإكمال المعمل!
              </Typography>
            </Alert>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default LabDetail;