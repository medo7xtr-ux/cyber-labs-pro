import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tab,
  Tabs,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Alert,
  Stack,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Assessment,
  Download,
  Visibility,
  TrendingUp,
  Timeline,
  BarChart,
  PieChart,
  CalendarToday,
  FilterList,
  Refresh,
  Share,
  Print,
  Email,
  Warning,
  CheckCircle,
  Schedule,
  ArrowDropDown
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { enqueueSnackbar } from 'notistack';

// مكونات المخططات (سيتم استبدالها بمخططات حقيقية لاحقاً)
const ProgressChart = ({ value, label }) => (
  <Box sx={{ width: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" fontWeight="bold">
        {value}%
      </Typography>
    </Box>
    <LinearProgress 
      variant="determinate" 
      value={value} 
      sx={{ 
        height: 8, 
        borderRadius: 4,
        bgcolor: alpha('#1976d2', 0.1)
      }}
    />
  </Box>
);

const StatCard = ({ title, value, change, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography color="text.secondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
          {change && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: change > 0 ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                mt: 0.5
              }}
            >
              <TrendingUp sx={{ 
                fontSize: 14, 
                mr: 0.5,
                transform: change > 0 ? 'none' : 'rotate(180deg)'
              }} />
              {Math.abs(change)}% {change > 0 ? 'زيادة' : 'نقصان'}
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
    </CardContent>
  </Card>
);

const Reports = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState(null);

  // تبويبات التقارير
  const reportTabs = [
    { label: 'نظرة عامة', icon: <Assessment /> },
    { label: 'تقارير الأداء', icon: <Timeline /> },
    { label: 'تقارير المعامل', icon: <BarChart /> },
    { label: 'تقارير المهارات', icon: <PieChart /> },
    { label: 'التقارير المحفوظة', icon: <CalendarToday /> }
  ];

  // فترات التصفية
  const periodOptions = [
    { value: 'week', label: 'آخر أسبوع' },
    { value: 'month', label: 'آخر شهر' },
    { value: 'quarter', label: 'آخر ربع سنة' },
    { value: 'year', label: 'آخر سنة' },
    { value: 'all', label: 'الكل' }
  ];

  // تحميل البيانات
  useEffect(() => {
    const fetchReportsData = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        // محاكاة جلب البيانات من API
        await new Promise(resolve => setTimeout(resolve, 1000));

        // بيانات تجريبية محسنة
        const mockReports = [
          { 
            id: 1, 
            title: 'تقرير الأداء الشامل - يناير 2024', 
            date: '2024-01-31', 
            status: 'مكتمل', 
            type: 'أداء',
            description: 'تحليل شامل لأدائك في جميع المعامل والدروس',
            fileSize: '2.4 MB',
            downloads: 15,
            tags: ['شامل', 'أداء', 'تحليل']
          },
          { 
            id: 2, 
            title: 'تحليل نقاط القوة والضعف', 
            date: '2024-01-25', 
            status: 'معلق', 
            type: 'تحليل',
            description: 'تحديد مجالات القوة والضعف في مهاراتك',
            fileSize: '1.8 MB',
            downloads: 8,
            tags: ['تحليل', 'مهارات']
          },
          { 
            id: 3, 
            title: 'إحصائيات التقدم في أمن الويب', 
            date: '2024-01-20', 
            status: 'مكتمل', 
            type: 'إحصائيات',
            description: 'تتبع تقدمك في مسار أمن تطبيقات الويب',
            fileSize: '3.1 MB',
            downloads: 22,
            tags: ['أمن الويب', 'تقدم', 'إحصائيات']
          },
          { 
            id: 4, 
            title: 'تقرير المهارات المكتسبة', 
            date: '2024-01-15', 
            status: 'قيد المراجعة', 
            type: 'تقييم',
            description: 'تقييم المهارات التي اكتسبتها خلال الشهر الماضي',
            fileSize: '1.5 MB',
            downloads: 12,
            tags: ['مهارات', 'تقييم']
          },
          { 
            id: 5, 
            title: 'مقارنة الأداء مع المتوسط', 
            date: '2024-01-10', 
            status: 'مكتمل', 
            type: 'مقارنة',
            description: 'مقارنة أدائك مع متوسط أداء المستخدمين',
            fileSize: '2.7 MB',
            downloads: 18,
            tags: ['مقارنة', 'أداء']
          }
        ];

        const mockStats = {
          totalReports: 24,
          completedReports: 18,
          pendingReports: 3,
          inReviewReports: 2,
          failedReports: 1,
          averageScore: 87,
          completionRate: 92,
          improvementRate: 12,
          timeSpent: '148h 30m',
          labsCompleted: 12,
          pointsEarned: 2450,
          accuracy: 89
        };

        setReports(mockReports);
        setStatistics(mockStats);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('حدث خطأ في تحميل التقارير');
        enqueueSnackbar('فشل في تحميل التقارير', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [isAuthenticated, filterPeriod]);

  // معالجة تنزيل التقرير
  const handleDownloadReport = (reportId) => {
    enqueueSnackbar('جارٍ تحميل التقرير...', { variant: 'info' });
    // TODO: تنفيذ تنزيل التقرير من API
    setTimeout(() => {
      enqueueSnackbar('تم تحميل التقرير بنجاح', { variant: 'success' });
    }, 1500);
  };

  // معالجة مشاركة التقرير
  const handleShareReport = (report) => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: report.description,
        url: `/reports/${report.id}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/reports/${report.id}`);
      enqueueSnackbar('تم نسخ رابط التقرير', { variant: 'success' });
    }
  };

  // معالجة إرسال التقرير بالبريد
  const handleEmailReport = (reportId) => {
    enqueueSnackbar('جارٍ إرسال التقرير إلى بريدك الإلكتروني...', { variant: 'info' });
    // TODO: تنفيذ إرسال التقرير بالبريد
    setTimeout(() => {
      enqueueSnackbar('تم إرسال التقرير بنجاح', { variant: 'success' });
    }, 1500);
  };

  // معالجة إنشاء تقرير جديد
  const handleGenerateReport = () => {
    enqueueSnackbar('جارٍ إنشاء تقرير جديد...', { variant: 'info' });
    // TODO: تنفيذ إنشاء تقرير جديد
    setTimeout(() => {
      enqueueSnackbar('تم إنشاء التقرير بنجاح', { variant: 'success' });
    }, 2000);
  };

  // تحديث البيانات
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      enqueueSnackbar('تم تحديث البيانات', { variant: 'success' });
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          يجب تسجيل الدخول للوصول إلى التقارير والإحصائيات
        </Alert>
        <Button variant="contained" href="/login">
          تسجيل الدخول
        </Button>
      </Container>
    );
  }

  if (loading && !statistics) {
    return <LoadingSpinner fullScreen type="assessment" message="جاري تحميل التقارير..." />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* شريط التحكم */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 3 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Assessment sx={{ verticalAlign: 'middle', mr: 1, color: 'primary.main' }} />
                التقارير والإحصائيات
              </Typography>
              <Typography variant="h6" color="text.secondary">
                تتبع تقدمك وأدائك في المنصة
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                endIcon={<ArrowDropDown />}
                onClick={() => setFilterPeriod('month')}
              >
                {periodOptions.find(p => p.value === filterPeriod)?.label || 'الفترة'}
              </Button>
              <Tooltip title="تحديث">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<Assessment />}
                onClick={handleGenerateReport}
              >
                تقرير جديد
              </Button>
            </Stack>
          </Box>

          {/* تبويبات التقارير */}
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem'
              }
            }}
          >
            {reportTabs.map((tab, index) => (
              <Tab 
                key={index} 
                icon={tab.icon} 
                iconPosition="start" 
                label={tab.label} 
              />
            ))}
          </Tabs>
        </Container>
      </Box>

      {/* المحتوى الرئيسي */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* تبويب النظرة العامة */}
        {activeTab === 0 && statistics && (
          <>
            {/* إحصائيات سريعة */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="إجمالي التقارير"
                  value={statistics.totalReports}
                  change={8}
                  icon={<Assessment />}
                  color={theme.palette.primary.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="المعامل المكتملة"
                  value={statistics.labsCompleted}
                  change={15}
                  icon={<CheckCircle />}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="النقاط المكتسبة"
                  value={statistics.pointsEarned.toLocaleString()}
                  change={12}
                  icon={<TrendingUp />}
                  color={theme.palette.warning.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="معدل الدقة"
                  value={`${statistics.accuracy}%`}
                  change={3}
                  icon={<Timeline />}
                  color={theme.palette.info.main}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {/* المخططات */}
              <Grid item xs={12} lg={8}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Timeline /> تقدم الأداء
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <ProgressChart value={statistics.averageScore} label="متوسط النقاط" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ProgressChart value={statistics.completionRate} label="معدل الإكمال" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ProgressChart value={statistics.improvementRate} label="معدل التحسن" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <ProgressChart value={85} label="الالتزام بالتعلم" />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Schedule /> الوقت المستثمر
                    </Typography>
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', textAlign: 'center', my: 2 }}>
                      {statistics.timeSpent}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      إجمالي الوقت المستثمر في التعلم
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* حالة التقارير */}
              <Grid item xs={12} lg={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Assessment /> حالة التقارير
                    </Typography>
                    
                    <Stack spacing={2} sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{ color: 'success.main' }} />
                          <Typography variant="body2">مكتمل</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          {statistics.completedReports}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule sx={{ color: 'warning.main' }} />
                          <Typography variant="body2">معلق</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          {statistics.pendingReports}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Warning sx={{ color: 'info.main' }} />
                          <Typography variant="body2">قيد المراجعة</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          {statistics.inReviewReports}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Warning sx={{ color: 'error.main' }} />
                          <Typography variant="body2">فشل</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          {statistics.failedReports}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Assessment />}
                      onClick={handleGenerateReport}
                    >
                      إنشاء تقرير جديد
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* تبويب التقارير */}
        {(activeTab === 1 || activeTab === 4) && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {activeTab === 4 ? 'التقارير المحفوظة' : 'تقارير الأداء'}
                </Typography>
                
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>ترتيب حسب</InputLabel>
                  <Select
                    value="newest"
                    label="ترتيب حسب"
                    size="small"
                  >
                    <MenuItem value="newest">الأحدث</MenuItem>
                    <MenuItem value="oldest">الأقدم</MenuItem>
                    <MenuItem value="name">حسب الاسم</MenuItem>
                    <MenuItem value="type">حسب النوع</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>التقرير</TableCell>
                      <TableCell>التاريخ</TableCell>
                      <TableCell>النوع</TableCell>
                      <TableCell>الحالة</TableCell>
                      <TableCell>التنزيلات</TableCell>
                      <TableCell>الإجراءات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {report.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {report.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              {report.tags.map((tag, index) => (
                                <Chip 
                                  key={index} 
                                  label={tag} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.type} 
                            size="small" 
                            sx={{ 
                              bgcolor: alpha(
                                report.type === 'أداء' ? theme.palette.primary.main :
                                report.type === 'تحليل' ? theme.palette.secondary.main :
                                report.type === 'إحصائيات' ? theme.palette.info.main :
                                report.type === 'تقييم' ? theme.palette.success.main :
                                theme.palette.warning.main,
                                0.1
                              ),
                              color: 
                                report.type === 'أداء' ? theme.palette.primary.main :
                                report.type === 'تحليل' ? theme.palette.secondary.main :
                                report.type === 'إحصائيات' ? theme.palette.info.main :
                                report.type === 'تقييم' ? theme.palette.success.main :
                                theme.palette.warning.main
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.status}
                            size="small"
                            color={
                              report.status === 'مكتمل' ? 'success' :
                              report.status === 'معلق' ? 'warning' :
                              report.status === 'قيد المراجعة' ? 'info' : 'default'
                            }
                            variant={report.status === 'مكتمل' ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {report.downloads}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {report.fileSize}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="عرض">
                              <IconButton size="small" href={`/reports/${report.id}`}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="تنزيل">
                              <IconButton size="small" onClick={() => handleDownloadReport(report.id)}>
                                <Download fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="مشاركة">
                              <IconButton size="small" onClick={() => handleShareReport(report)}>
                                <Share fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="إرسال بالبريد">
                              <IconButton size="small" onClick={() => handleEmailReport(report.id)}>
                                <Email fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="طباعة">
                              <IconButton size="small">
                                <Print fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* تبويبات أخرى (تحت التطوير) */}
        {(activeTab === 2 || activeTab === 3) && (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              {activeTab === 2 ? (
                <BarChart sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 3 }} />
              ) : (
                <PieChart sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 3 }} />
              )}
              <Typography variant="h5" gutterBottom color="text.secondary">
                {activeTab === 2 ? 'تقارير المعامل' : 'تقارير المهارات'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                هذا القسم قيد التطوير. سيتم إضافة المخططات التفصيلية والتحليلات المتقدمة قريباً.
              </Typography>
              <Button variant="outlined">
                معرفة المزيد
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default Reports;