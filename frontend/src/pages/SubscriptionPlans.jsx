// frontend/src/pages/SubscriptionPlans.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Lock as LockIcon,
  CreditCard as CreditCardIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionsAPI } from '../services/api';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user, isPremium } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await subscriptionsAPI.getPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      // محاكاة عملية الدفع - سيتم ربطها بـ Stripe لاحقاً
      const response = await subscriptionsAPI.subscribe(planId);
      
      if (response.data.success) {
        alert('تم الاشتراك بنجاح!');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('حدث خطأ أثناء عملية الاشتراك');
    }
  };

  const getPlanColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'warning'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        خطط الاشتراك
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        اختر الخطة المناسبة لاحتياجاتك وابدأ رحلتك التعليمية
      </Typography>

      {isPremium && (
        <Alert severity="info" sx={{ mb: 4 }}>
          أنت مشترك بالفعل في خطة مميزة. يمكنك ترقية خطتك أو إدارتها من لوحة التحكم.
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {plans.map((plan, index) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: selectedPlan === plan.id ? '2px solid' : '1px solid rgba(0,0,0,0.1)',
                borderColor: selectedPlan === plan.id ? `${getPlanColor(index)}.main` : 'transparent',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              {plan.is_popular && (
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                  <Chip
                    icon={<StarIcon />}
                    label="الأكثر شيوعاً"
                    color="secondary"
                  />
                </Box>
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom align="center">
                  {plan.name}
                </Typography>
                
                <Box sx={{ textAlign: 'center', my: 3 }}>
                  <Typography variant="h3" color="primary.main">
                    {plan.price} ريال
                  </Typography>
                  <Typography color="text.secondary">
                    / {plan.period === 'monthly' ? 'شهر' : 
                       plan.period === 'yearly' ? 'سنة' : 
                       plan.period === 'lifetime' ? 'مدى الحياة' : plan.period}
                  </Typography>
                </Box>
                
                <Typography color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                
                <List dense>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant={selectedPlan === plan.id ? 'contained' : 'outlined'}
                  size="large"
                  startIcon={<CreditCardIcon />}
                  onClick={() => {
                    if (isPremium) {
                      alert('لديك اشتراك نشط بالفعل');
                    } else {
                      setSelectedPlan(plan.id);
                      handleSubscribe(plan.id);
                    }
                  }}
                  disabled={isPremium}
                >
                  {isPremium ? 'مشترك بالفعل' : 'اشترك الآن'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* معلومات الدفع */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          معلومات الدفع الآمن
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • جميع المعاملات محمية بتشفير 256-bit SSL
          <br />
          • لا نخزن بيانات بطاقتك الائتمانية
          <br />
          • يمكنك الإلغاء في أي وقت
          <br />
          • ضمان استعادة الأموال خلال 14 يوم
        </Typography>
      </Box>
    </Container>
  );
};

export default SubscriptionPlans;