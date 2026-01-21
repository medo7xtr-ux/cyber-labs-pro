// frontend/src/pages/Tutorials.jsx
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Article as ArticleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const Tutorials = () => {
  const tutorials = [
    {
      id: 1,
      title: 'مقدمة في الأمن السيبراني',
      description: 'تعرف على أساسيات الأمن السيبراني والمفاهيم الرئيسية',
      type: 'مقالة',
      duration: '20 دقيقة',
      isFree: true,
    },
    {
      id: 2,
      title: 'كيفية اكتشاف الثغرات',
      description: 'تعلم منهجيات اكتشاف الثغرات في التطبيقات والأنظمة',
      type: 'فيديو',
      duration: '45 دقيقة',
      isFree: true,
    },
    {
      id: 3,
      title: 'أدوات اختبار الاختراق المتقدمة',
      description: 'استعراض لأهم الأدوات المستخدمة في اختبار الاختراق',
      type: 'دورة',
      duration: '3 ساعات',
      isFree: false,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        المكتبة التعليمية
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        استعرض مكتبتنا الشاملة من الدروس والمقالات والدورات التعليمية
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {tutorials.map((tutorial) => (
          <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {!tutorial.isFree && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 1,
                  }}
                >
                  <Chip
                    icon={<LockIcon />}
                    label="مميز"
                    color="secondary"
                    size="small"
                  />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tutorial.type === 'فيديو' && (
                    <VideoIcon color="primary" sx={{ mr: 1 }} />
                  )}
                  {tutorial.type === 'مقالة' && (
                    <ArticleIcon color="primary" sx={{ mr: 1 }} />
                  )}
                  {tutorial.type === 'دورة' && (
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  )}
                  <Chip label={tutorial.type} size="small" />
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tutorial.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {tutorial.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip label={tutorial.duration} size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {tutorial.isFree ? 'مجاني' : 'مدفوع'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tutorial.isFree ? 'contained' : 'outlined'}
                  startIcon={<SchoolIcon />}
                >
                  {tutorial.isFree ? 'ابدأ التعلم' : 'اشترك للوصول'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Tutorials;