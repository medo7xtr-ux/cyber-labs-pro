import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h1" sx={{ fontSize: '8rem', fontWeight: 'bold', color: 'text.secondary' }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        الصفحة غير موجودة
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          size="large"
        >
          العودة للرئيسية
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          size="large"
        >
          العودة للخلف
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;