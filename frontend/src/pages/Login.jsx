import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Stack, 
  IconButton, 
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Security } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <Security sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h4" fontWeight="800" gutterBottom>مرحباً بك مجدداً</Typography>
            <Typography variant="body1" color="text.secondary">سجل دخولك للمتابعة في رحلة التعلم</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                variant="outlined"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="كلمة المرور"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                type="submit"
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                تسجيل الدخول
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              ليس لديك حساب؟{' '}
              <Button onClick={() => navigate('/register')} sx={{ fontWeight: 700 }}>سجل الآن</Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
