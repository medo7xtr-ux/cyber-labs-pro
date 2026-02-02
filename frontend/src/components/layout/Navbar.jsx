import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Typography,
  Stack,
  useTheme,
  alpha,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Security,
  Dashboard,
  Science,
  ExitToApp,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'الرئيسية', path: '/' },
    { label: 'المعامل', path: '/labs' },
    { label: 'لوحة التحكم', path: '/dashboard', auth: true },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        bgcolor: scrolled ? alpha(theme.palette.background.paper, 0.8) : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? theme.shadows[1] : 'none',
        borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Security sx={{ color: theme.palette.primary.main, fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary }}>
              CyberLabs
            </Typography>
          </Box>

          {/* Desktop Nav */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              (!item.auth || isAuthenticated) && (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    '&:hover': { color: theme.palette.primary.main }
                  }}
                >
                  {item.label}
                </Button>
              )
            ))}
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2} alignItems="center">
            {isAuthenticated ? (
              <>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="error">
                    <NotificationsIcon sx={{ color: theme.palette.text.secondary }} />
                  </Badge>
                </IconButton>
                <Box onClick={handleMenuOpen} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: theme.palette.primary.main,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 3 } }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
                    <Dashboard sx={{ mr: 1.5, fontSize: 20 }} /> لوحة التحكم
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                    <Person sx={{ mr: 1.5, fontSize: 20 }} /> الملف الشخصي
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ExitToApp sx={{ mr: 1.5, fontSize: 20 }} /> تسجيل الخروج
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button onClick={() => navigate('/login')} sx={{ color: theme.palette.text.primary }}>
                  دخول
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/register')}
                >
                  ابدأ الآن
                </Button>
              </Stack>
            )}
            
            {/* Mobile Menu Icon */}
            <IconButton sx={{ display: { xs: 'flex', md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
