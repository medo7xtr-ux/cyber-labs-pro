// frontend/src/components/labs/LabInterface.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Code as CodeIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';

// بيانات جميع المعامل
const labsData = {
  1: {
    id: 1,
    title: 'حقن SQL (SQL Injection)',
    description: 'هذا المعمل يعلمك كيفية اكتشاف واستغلال ثغرات حقن SQL.',
    objective: 'هدفك هو استخراج بيانات سرية من قاعدة البيانات باستخدام حقن SQL.',
    difficulty: 'سهل',
    time: '30 دقيقة',
    hint: 'جرب استخدام علامات الاقتباس لإغلاق الاستعلام ثم إضافة شرط دائماً صحيح.',
    solution: "' OR '1'='1",
    type: 'sql',
    category: 'ثغرات الويب',
    points: 100,
    instructions: [
      'أدخل استعلام SQL في الحقل المخصص',
      'انقر على زر "تنفيذ" لاختبار الاستعلام',
      'إذا استطعت استخراج البيانات، ستظهر رسالة نجاح',
      'يمكنك استخدام الأزرار المساعدة إذا واجهت صعوبة',
    ],
    testCode: (code) => {
      if (code.includes("' OR '1'='1") || code.includes('" OR "1"="1')) {
        return {
          success: true,
          message: '✅ نجاح! تم استخراج البيانات:\n- اسم المستخدم: admin\n- كلمة المرور: secret123\n- البريد الإلكتروني: admin@cyberlabs.com',
          points: 100,
        };
      }
      return {
        success: false,
        message: '❌ فشل! لم يتم استخراج البيانات. حاول مرة أخرى.',
        points: 0,
      };
    },
  },
  2: {
    id: 2,
    title: 'XSS (Cross-Site Scripting)',
    description: 'تعلم كيفية استغلال ثغرات XSS لحقن وتنفيذ كود JavaScript في المتصفح.',
    objective: 'هدفك هو حقن كود JavaScript ينبّه بكلمة "نجاح" عند زيارة الصفحة.',
    difficulty: 'متوسط',
    time: '45 دقيقة',
    hint: 'جرب استخدام وسم script لحقن كود JavaScript.',
    solution: '<script>alert("نجاح")</script>',
    type: 'xss',
    category: 'ثغرات الويب',
    points: 150,
    instructions: [
      'أدخل كود JavaScript في حقل الإدخال',
      'انقر على زر "تنفيذ" لمحاكاة الهجوم',
      'إذا نجحت، سترى رسالة تنبيه بكلمة "نجاح"',
      'تأكد من فهمك لطريقة عمل XSS',
    ],
    testCode: (code) => {
      if (code.includes('<script>alert') || code.includes('javascript:')) {
        return {
          success: true,
          message: '✅ نجاح! تم تنفيذ كود JavaScript بنجاح.\nتم إظهار رسالة التنبيه: "نجاح"',
          points: 150,
        };
      }
      return {
        success: false,
        message: '❌ فشل! لم يتم تنفيذ الكود. حاول مرة أخرى.',
        points: 0,
      };
    },
  },
  3: {
    id: 3,
    title: 'تجاوز سعة المخزن المؤقت (Buffer Overflow)',
    description: 'تعلم أساسيات هجمات تجاوز سعة المخزن المؤقت على الأنظمة القديمة.',
    objective: 'هدفك هو تجاوز سعة المخزن المؤقت وتغيير مسار تنفيذ البرنامج.',
    difficulty: 'صعب',
    time: '60 دقيقة',
    hint: 'أدخل بيانات أطول من السعة المخصصة للمخزن المؤقت.',
    solution: 'A'.repeat(100),
    type: 'buffer',
    category: 'ثغرات النظام',
    points: 200,
    instructions: [
      'أدخل بيانات طويلة في حقل الإدخال',
      'انقر على زر "تنفيذ" لمحاكاة الهجوم',
      'إذا نجحت، ستغير مسار تنفيذ البرنامج',
      'هذا الهجوم يعمل على أنظمة قديمة غير محمية',
    ],
    testCode: (code) => {
      if (code.length > 50) {
        return {
          success: true,
          message: '✅ نجاح! تم تجاوز سعة المخزن المؤقت.\nتم تغيير مسار التنفيذ إلى العنوان: 0x41414141',
          points: 200,
        };
      }
      return {
        success: false,
        message: '❌ فشل! البيانات قصيرة جدًا. حاول إدخال بيانات أطول.',
        points: 0,
      };
    },
  },
};

const LabInterface = ({ labId }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [searchParams] = useSearchParams();

  // الحصول على بيانات المعمل بناءً على ID
  const labData = labsData[labId] || labsData[1];

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('جاري تنفيذ الكود...');
    
    setTimeout(() => {
      const result = labData.testCode(code);
      setOutput(result.message);
      setIsRunning(false);
      
      // زيادة التقدم إذا نجح
      if (result.success && progress < 100) {
        setProgress(100);
      }
    }, 1500);
  };

  const handleHintClick = () => {
    setShowHint(!showHint);
  };

  const handleSolutionClick = () => {
    setShowSolution(!showSolution);
    if (!showSolution) {
      setCode(labData.solution);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 100;
        }
        const diff = Math.random() * 5;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      {/* شريط التقدم */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">تقدمك في المعمل</Typography>
          <Typography variant="body2">{Math.round(progress)}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      <Grid container spacing={3}>
        {/* القسم الأيسر: معلومات وشرح */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {labData.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={labData.category} size="small" color="primary" />
              <Chip label={`${labData.points} نقطة`} size="small" variant="outlined" />
            </Box>
            <Typography color="text.secondary" paragraph>
              {labData.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* تبويبات */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="الهدف التعليمي" />
                <Tab label="التعليمات" />
                <Tab label="المعلومات النظرية" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  الهدف التعليمي
                </Typography>
                <Typography paragraph>
                  {labData.objective}
                </Typography>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  التعليمات
                </Typography>
                <Typography component="div" sx={{ pl: 2 }}>
                  <ol>
                    {labData.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </Typography>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  <SecurityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  المعلومات النظرية
                </Typography>
                <Typography paragraph>
                  {labData.type === 'sql' && 'هجوم حقن SQL هو نوع من الهجمات حيث يتم إدخال تعليمات SQL خبيثة في حقل إدخال للتطبيق، مما يؤدي إلى تنفيذ أوامر SQL غير مقصودة على قاعدة البيانات.'}
                  {labData.type === 'xss' && 'هجوم XSS يسمح للمهاجم بحقن كود JavaScript في صفحات الويب التي يراها المستخدمون الآخرون، مما يمكنه من سرية الجلسات أو إعادة توجيه المستخدمين.'}
                  {labData.type === 'buffer' && 'هجوم تجاوز سعة المخزن المؤقت يحدث عندما يكتب برنامج بيانات في المخزن المؤقت تتجاوز سعته، مما قد يؤدي إلى تغيير مسار تنفيذ البرنامج.'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* القسم الأيمن: المعلومات الجانبية */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                معلومات المعمل
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>الصعوبة:</strong> {labData.difficulty}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>الوقت المقدر:</strong> {labData.time}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>النقاط:</strong> {labData.points} نقطة
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>النوع:</strong> {labData.category}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الأدوات المساعدة
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<InfoIcon />}
                  onClick={handleHintClick}
                  fullWidth
                >
                  {showHint ? 'إخفاء التلميح' : 'عرض تلميح'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  onClick={handleSolutionClick}
                  fullWidth
                >
                  {showSolution ? 'إخفاء الحل' : 'عرض الحل'}
                </Button>
              </Box>

              {showHint && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {labData.hint}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* محرر الكود */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              بيئة الاختبار
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={
                labData.type === 'sql' ? 'أدخل استعلام SQL هنا...' :
                labData.type === 'xss' ? 'أدخل كود JavaScript هنا...' :
                'أدخل البيانات هنا...'
              }
              variant="outlined"
              sx={{ mb: 2, fontFamily: 'monospace' }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? 'جاري التنفيذ...' : 'تنفيذ'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCode('')}
              >
                مسح
              </Button>
            </Box>

            {/* ناتج التنفيذ */}
            {output && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: '#1e1e1e',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  الناتج:
                </Typography>
                {output}
              </Paper>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LabInterface;