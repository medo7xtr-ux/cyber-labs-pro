import React from 'react';
import { Box, Container, Grid, Typography, Link, Stack, IconButton, alpha, useTheme } from '@mui/material';
import { Security, GitHub, Twitter, LinkedIn, Telegram } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      pt: 10, 
      pb: 6, 
      borderTop: `1px solid ${theme.palette.divider}`,
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ mb: 8 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Security sx={{ color: theme.palette.primary.main, fontSize: 32, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>CyberLabs</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 300 }}>
              المنصة العربية الرائدة لتعلم الأمن السيبراني والاختراق الأخلاقي بطريقة عملية وتفاعلية.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[GitHub, Twitter, LinkedIn, Telegram].map((Icon, i) => (
                <IconButton key={i} sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: theme.palette.primary.main, color: 'white' }
                }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3 }}>المنصة</Typography>
            <Stack spacing={2}>
              {['المعامل', 'المسارات', 'الأسعار', 'المجتمع'].map((item) => (
                <Link key={item} href="#" underline="none" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3 }}>الدعم</Typography>
            <Stack spacing={2}>
              {['مركز المساعدة', 'الأسئلة الشائعة', 'تواصل معنا', 'الحالة'].map((item) => (
                <Link key={item} href="#" underline="none" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 3 }}>اشترك في النشرة البريدية</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              احصل على آخر التحديثات والمعامل الجديدة مباشرة في بريدك.
            </Typography>
            {/* يمكن إضافة حقل إدخال هنا لاحقاً */}
          </Grid>
        </Grid>
        
        <Box sx={{ 
          pt: 4, 
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} CyberLabs. جميع الحقوق محفوظة.
          </Typography>
          <Stack direction="row" spacing={4}>
            <Link href="#" underline="none" color="text.secondary" variant="body2">سياسة الخصوصية</Link>
            <Link href="#" underline="none" color="text.secondary" variant="body2">شروط الاستخدام</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
