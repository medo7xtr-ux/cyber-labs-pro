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
  Grid,
  alpha,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    const result = await register(formData);
    if (result.success) navigate('/dashboard');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      py: 8
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 4 }}>
            <PersonAdd sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h4" fontWeight="800" gutterBottom>إنشاء حساب جديد</Typography>
            <Typography variant="body1" color="text.secondary">انضم إلى آلاف المتعلمين في CyberLabs</Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="اسم المستخدم"
                variant="outlined"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
                }}
              />
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="كلمة المرور"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="تأكيد كلمة المرور"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </Grid>
              </Grid>
              
              <Button 
                fullWidth 
                variant="contained" 
                size="large" 
                type="submit"
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                إنشاء الحساب
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              لديك حساب بالفعل؟{' '}
              <Button onClick={() => navigate('/login')} sx={{ fontWeight: 700 }}>تسجيل الدخول</Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
