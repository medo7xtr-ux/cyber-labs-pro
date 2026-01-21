import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <ErrorOutline
          sx={{
            fontSize: 80,
            color: 'error.main',
            mb: 2
          }}
        />
        
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          حدث خطأ غير متوقع
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 3,
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            textAlign: 'left',
            direction: 'ltr'
          }}
        >
          {error?.message || 'حدث خطأ في التطبيق'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={resetErrorBoundary}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            إعادة المحاولة
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/'}
            sx={{
              borderColor: 'grey.400',
              color: 'grey.700'
            }}
          >
            العودة للرئيسية
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;