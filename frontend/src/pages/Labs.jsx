import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Drawer,
  useTheme,
  alpha,
  Fab,
  Tooltip,
  CircularProgress,
  Alert,
  Divider,
  Badge
} from '@mui/material';
import {
  Search,
  FilterList,
  Science,
  TrendingUp,
  AccessTime,
  Star,
  LockOpen,
  Lock,
  Sort,
  GridView,
  ViewList,
  Add,
  Refresh,
  Whatshot,
  NewReleases,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as labsService from '../services/labs';
import { getCategoryInfo, getDifficultyInfo } from '../config/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

// خيارات الفرز
const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث', icon: <NewReleases /> },
  { value: 'popular', label: 'الأكثر شعبية', icon: <TrendingUp /> },
  { value: 'difficulty', label: 'الصعوبة', icon: <Whatshot /> },
  { value: 'points', label: 'النقاط', icon: <Star /> },
  { value: 'completion', label: 'معدل الإكمال', icon: <Timeline /> }
];

// خيارات التصفية
const DIFFICULTY_OPTIONS = [
  { value: 'all', label: 'جميع المستويات' },
  { value: 'beginner', label: 'مبتدئ' },
  { value: 'intermediate', label: 'متوسط' },
  { value: 'advanced', label: 'متقدم' },
  { value: 'expert', label: 'خبير' }
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'جميع الحالات' },
  { value: 'not_started', label: 'لم يبدأ' },
  { value: 'in_progress', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'مكتمل' }
];

const Labs = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isPremium } = useAuth();

  // الحالة
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid أو list

  // عوامل التصفية
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    difficulty: searchParams.get('difficulty') || 'all',
    status: searchParams.get('status') || 'all',
    sortBy: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || 1),
    limit: 12
  });

  // البيانات الإضافية
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    total_items: 0
  });

  // تحميل المعامل
  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        ...filters,
        page: filters.page,
        limit: filters.limit
      };

      // تنظيف المعلمات
      Object.keys(params).forEach(key => {
        if (params[key] === 'all' || params[key] === '') {
          delete params[key];
        }
      });

      const result = await labsService.getAllLabs(params);

      if (result.success) {
        setLabs(result.labs);
        setPagination(result.pagination);
        
        // تحديث URL
        const newParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            newParams.set(key, value);
          }
        });
        setSearchParams(newParams);
      } else {
        setError(result.message || 'فشل في تحميل المعامل');
      }
    } catch (err) {
      console.error('Error fetching labs:', err);
      setError('حدث خطأ في تحميل المعامل');
    } finally {
      setLoading(false);
    }
  };

  // تحميل التصنيفات
  const fetchCategories = async () => {
    try {
      const result = await labsService.getCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // تأثير التحميل الأولي
  useEffect(() => {
    fetchCategories();
  }, []);

  // تأثير التحميل عند تغيير الفلاتر
  useEffect(() => {
    fetchLabs();
  }, [filters.page, filters.sortBy, filters.difficulty, filters.category, filters.status]);

  // معالجة تغيير الفلاتر
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // العودة للصفحة الأولى عند تغيير الفلتر
    }));
  };

  // معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  // بدء معمل
  const handleStartLab = async (lab) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/labs/${lab.id}` } });
      return;
    }

    if (lab.is_premium && !isPremium) {
      navigate('/subscription');
      return;
    }

    try {
      const result = await labsService.startLab(lab.id);
      if (result.success) {
        navigate(`/labs/${lab.id}/challenge`);
      }
    } catch (err) {
      console.error('Error starting lab:', err);
    }
  };

  // مسح الفلاتر
  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      difficulty: 'all',
      status: 'all',
      sortBy: 'newest',
      page: 1,
      limit: 12
    });
    setFilterDrawerOpen(false);
  };

  // حساب عدد المعامل المصفاة
  const filteredLabsCount = useMemo(() => {
    return labs.length;
  }, [labs]);

  // حساب عدد الفلاتر النشطة
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.difficulty !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  // مكون بطاقة المعمل
  const LabCard = ({ lab }) => {
    const categoryInfo = getCategoryInfo(lab.category);
    const difficultyInfo = getDifficultyInfo(lab.difficulty);

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          border: lab.is_premium ? `2px solid ${theme.palette.warning.main}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderColor: alpha(theme.palette.primary.main, 0.3)
          }
        }}
      >
        {/* علامة المعمل المميز */}
        {lab.is_premium && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 1,
              bgcolor: theme.palette.warning.main,
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
            }}
          >
            <Star sx={{ fontSize: 14 }} />
            مميز
          </Box>
        )}

        {/* صورة المعمل */}
        <CardMedia
          component="div"
          sx={{
            height: 160,
            position: 'relative',
            background: `linear-gradient(45deg, ${categoryInfo.color}30, ${alpha(categoryInfo.color, 0.1)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ opacity: 0.2, color: categoryInfo.color }}>
              {categoryInfo.icon}
            </Typography>
          </Box>
          
          {/* شريط التقدم */}
          {lab.user_progress && lab.user_progress.progress > 0 && (
            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <LinearProgress 
                variant="determinate" 
                value={lab.user_progress.progress} 
                sx={{ 
                  height: 4,
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: theme.palette.primary.main
                  }
                }}
              />
            </Box>
          )}
        </CardMedia>

        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          {/* العنوان والفئة */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                height: '2.8em',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {lab.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
              <Chip
                label={categoryInfo.ar}
                size="small"
                sx={{ 
                  bgcolor: alpha(categoryInfo.color, 0.1),
                  color: categoryInfo.color,
                  fontWeight: 'medium'
                }}
              />
              <Chip
                label={difficultyInfo.ar}
                size="small"
                sx={{ 
                  bgcolor: alpha(difficultyInfo.color, 0.1),
                  color: difficultyInfo.color,
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Box>

          {/* الوصف */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: '4.2em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {lab.description || 'لا يوجد وصف متوفر لهذا المعمل.'}
          </Typography>

          {/* الإحصائيات */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {lab.points || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                نقاط
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {lab.estimated_time || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                دقيقة
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {lab.completions || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                إكمال
              </Typography>
            </Box>
          </Box>

          {/* مؤشر التقدم */}
          {lab.user_progress && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  تقدمك
                </Typography>
                <Typography variant="caption" fontWeight="bold" color="primary">
                  {lab.user_progress.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={lab.user_progress.progress} 
                sx={{ 
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }}
              />
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant={lab.user_progress?.started ? "outlined" : "contained"}
            fullWidth
            onClick={() => handleStartLab(lab)}
            startIcon={lab.is_premium && !isPremium ? <Lock /> : <Science />}
            disabled={lab.is_premium && !isPremium}
            sx={{
              fontWeight: 'bold',
              py: 1,
              borderRadius: 2
            }}
          >
            {lab.is_premium && !isPremium ? 'اشترك للوصول' :
             lab.user_progress?.started ? 'استكمل المعمل' : 'بدء المعمل'}
          </Button>
        </CardActions>
      </Card>
    );
  };

  if (loading && labs.length === 0) {
    return <LoadingSpinner fullScreen type="science" message="جاري تحميل المعامل..." />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* شريط التحكم العلوي */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 3
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Science sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                المعامل الأمنية
              </Typography>
              <Typography variant="h6" color="text.secondary">
                طور مهاراتك من خلال {pagination.total_items} معمل تفاعلي
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {/* زر تبديل العرض */}
              <Tooltip title={viewMode === 'grid' ? 'عرض كقائمة' : 'عرض كشبكة'}>
                <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                  {viewMode === 'grid' ? <ViewList /> : <GridView />}
                </IconButton>
              </Tooltip>

              {/* زر التحديث */}
              <Tooltip title="تحديث">
                <IconButton onClick={fetchLabs}>
                  <Refresh />
                </IconButton>
              </Tooltip>

              {/* زر إنشاء معمل جديد (للمشرفين) */}
              {isAuthenticated && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/labs/create')}
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  معمل جديد
                </Button>
              )}
            </Stack>
          </Box>

          {/* شريط البحث والفلاتر */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* بحث */}
            <form onSubmit={handleSearch} style={{ flex: 1, minWidth: 300 }}>
              <TextField
                fullWidth
                placeholder="ابحث في المعامل..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </form>

            {/* الفلاتر */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {/* فلتر الصعوبة */}
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>المستوى</InputLabel>
                <Select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  label="المستوى"
                  size="small"
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* فلتر الحالة */}
              {isAuthenticated && (
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel>الحالة</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="الحالة"
                    size="small"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* فلتر الترتيب */}
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>الترتيب</InputLabel>
                <Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  label="الترتيب"
                  size="small"
                  startAdornment={<Sort sx={{ mr: 1 }} />}
                >
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* زر الفلاتر */}
              <Badge badgeContent={activeFiltersCount} color="primary">
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterDrawerOpen(true)}
                  sx={{ height: 40 }}
                >
                  فلاتر
                </Button>
              </Badge>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* المحتوى الرئيسي */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* عدد النتائج */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography color="text.secondary">
            عرض {filteredLabsCount} من {pagination.total_items} معمل
          </Typography>
          
          {activeFiltersCount > 0 && (
            <Button 
              variant="text" 
              size="small" 
              onClick={clearFilters}
              sx={{ color: 'text.secondary' }}
            >
              مسح الفلاتر
            </Button>
          )}
        </Box>

        {/* قائمة المعامل */}
        {labs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Science sx={{ fontSize: 80, color: 'text.secondary', mb: 3, opacity: 0.5 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              لا توجد معامل متطابقة مع بحثك
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              حاول استخدام مصطلحات بحث مختلفة أو مسح الفلاتر
            </Typography>
            <Button variant="outlined" onClick={clearFilters}>
              مسح جميع الفلاتر
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {labs.map((lab) => (
                <Grid 
                  item 
                  key={lab.id} 
                  xs={12} 
                  sm={viewMode === 'grid' ? 6 : 12} 
                  md={viewMode === 'grid' ? 4 : 12}
                  lg={viewMode === 'grid' ? 3 : 12}
                >
                  <LabCard lab={lab} />
                </Grid>
              ))}
            </Grid>

            {/* الترقيم */}
            {pagination.total_pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pagination.total_pages}
                  page={filters.page}
                  onChange={(e, page) => handleFilterChange('page', page)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* درج الفلاتر */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 320,
            p: 3
          }
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          <FilterList sx={{ verticalAlign: 'middle', mr: 1 }} />
          الفلاتر المتقدمة
        </Typography>
        
        <Divider sx={{ my: 2 }} />

        {/* فلتر التصنيفات */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>التصنيف</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            label="التصنيف"
          >
            <MenuItem value="all">جميع التصنيفات</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.slug}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* فلتر النقاط */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            النقاط
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {['all', '0-100', '101-200', '201-300', '300+'].map((range) => (
              <Chip
                key={range}
                label={range === 'all' ? 'الكل' : range}
                onClick={() => handleFilterChange('points_range', range)}
                color={filters.points_range === range ? 'primary' : 'default'}
                variant={filters.points_range === range ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        {/* فلتر الوقت */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            الوقت المقدر
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {['all', '0-30', '31-60', '61-90', '90+'].map((time) => (
              <Chip
                key={time}
                label={time === 'all' ? 'الكل' : `${time} دقيقة`}
                onClick={() => handleFilterChange('time_range', time)}
                color={filters.time_range === time ? 'primary' : 'default'}
                variant={filters.time_range === time ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        {/* فلتر النوع */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            نوع المعمل
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {[
              { value: 'all', label: 'الكل' },
              { value: 'free', label: 'مجاني' },
              { value: 'premium', label: 'مميز' }
            ].map((type) => (
              <Chip
                key={type.value}
                label={type.label}
                onClick={() => handleFilterChange('type', type.value)}
                color={filters.type === type.value ? 'primary' : 'default'}
                variant={filters.type === type.value ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>

        {/* أزرار الإجراءات */}
        <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={clearFilters}
          >
            مسح الكل
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setFilterDrawerOpen(false)}
          >
            تطبيق
          </Button>
        </Box>
      </Drawer>

      {/* زر العودة للأعلى */}
      <Fab
        color="primary"
        aria-label="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          display: { xs: 'none', md: 'flex' }
        }}
      >
        <TrendingUp />
      </Fab>
    </Box>
  );
};

export default Labs;