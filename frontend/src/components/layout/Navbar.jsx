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
  InputBase,
  alpha,
  useTheme,
  useMediaQuery,
  Divider,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Fade,
  Slide
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Science,
  Dashboard,
  School,
  Assessment,
  Home,
  Code,
  TrendingUp,
  Close,
  ArrowDropDown,
  Brightness4,
  Brightness7,
  Settings,
  ExitToApp,
  Help,
  Security
} from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';

// مكون بحث مخصص
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: 0,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(1),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const Navbar = ({ onMenuClick, onThemeToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const { user, logout, isAuthenticated, isPremium } = useAuth();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // تتبع التمرير
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // إغلاق البحث عند تغيير المسار
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // قائمة التنقل الرئيسية
  const navItems = [
    { label: 'الرئيسية', icon: <Home />, path: '/', exact: true },
    { label: 'المعامل', icon: <Science />, path: '/labs' },
    { label: 'الدروس', icon: <School />, path: '/tutorials' },
    { label: 'التقارير', icon: <Assessment />, path: '/reports', auth: true },
    { label: 'المجتمع', icon: <TrendingUp />, path: '/community' },
  ];

  // قائمة المستخدم
  const userMenuItems = [
    { label: 'لوحة التحكم', icon: <Dashboard />, path: '/dashboard' },
    { label: 'الملف الشخصي', icon: <PersonIcon />, path: '/profile' },
    { label: 'الإعدادات', icon: <Settings />, path: '/settings' },
    { label: 'المساعدة', icon: <Help />, path: '/help' },
    { label: 'تسجيل الخروج', icon: <ExitToApp />, action: handleLogout },
  ];

  // الإشعارات التجريبية
  const notifications = [
    { id: 1, title: 'معمل جديد', message: 'تم إضافة معمل أمن الشبكات', time: 'منذ 5 دقائق', read: false, type: 'info' },
    { id: 2, title: 'إنجاز جديد', message: 'لقد حصلت على شارة المحترف', time: 'منذ يوم', read: false, type: 'success' },
    { id: 3, title: 'تذكير', message: 'معمل التشفير ينتهي غداً', time: 'منذ 3 أيام', read: true, type: 'warning' },
    { id: 4, title: 'تحديث النظام', message: 'تم تحديث المنصة إلى الإصدار 1.2.0', time: 'منذ أسبوع', read: true, type: 'info' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // معالجة الأحداث
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // مكون شريط البحث
  const SearchBar = () => (
    <Slide direction="left" in={searchOpen} mountOnEnter unmountOnExit>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mr: 2 }}>
        <form onSubmit={handleSearch} style={{ width: '100%' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="ابحث في المعامل والدروس..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </Search>
        </form>
        <IconButton color="inherit" onClick={toggleSearch}>
          <Close />
        </IconButton>
      </Box>
    </Slide>
  );

  return (
    <>
      <AppBar 
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          backgroundColor: scrolled ? alpha(theme.palette.background.paper, 0.9) : 'transparent',
          borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
          transition: 'all 0.3s ease',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 70 }}>
          {/* القسم الأيسر: الشعار والقائمة */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {/* زر القائمة للجوال */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={onMenuClick || handleMobileMenuOpen}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* الشعار */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mr: 3
              }}
              onClick={() => navigate('/')}
            >
              <Security sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main,
                mr: 1
              }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                CyberLabs
              </Typography>
            </Box>

            {/* قائمة التنقل (للشاشات الكبيرة) */}
            {!isMobile && (
              <Stack direction="row" spacing={1}>
                {navItems.map((item) => {
                  if (item.auth && !isAuthenticated) return null;
                  
                  return (
                    <Button
                      key={item.label}
                      startIcon={item.icon}
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: isActive(item.path, item.exact) 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                        fontWeight: isActive(item.path, item.exact) ? 'bold' : 'normal',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          transform: isActive(item.path, item.exact) 
                            ? 'translateX(-50%) scaleX(1)' 
                            : 'translateX(-50%) scaleX(0)',
                          width: '100%',
                          height: 2,
                          backgroundColor: theme.palette.primary.main,
                          transition: 'transform 0.3s ease'
                        },
                        '&:hover::after': {
                          transform: 'translateX(-50%) scaleX(1)'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* القسم الأيمن: البحث وإجراءات المستخدم */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* شريط البحث */}
            {!isMobile && !searchOpen && (
              <IconButton color="inherit" onClick={toggleSearch}>
                <SearchIcon />
              </IconButton>
            )}

            {isMobile ? (
              searchOpen ? (
                <SearchBar />
              ) : (
                <IconButton color="inherit" onClick={toggleSearch}>
                  <SearchIcon />
                </IconButton>
              )
            ) : (
              <SearchBar />
            )}

            {/* زر تبديل السمة */}
            <IconButton color="inherit" onClick={onThemeToggle}>
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* الإشعارات (للمستخدمين المسجلين) */}
            {isAuthenticated && (
              <>
                <IconButton color="inherit" onClick={handleNotificationsOpen}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <Menu
                  anchorEl={notificationsAnchor}
                  open={Boolean(notificationsAnchor)}
                  onClose={handleNotificationsClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{ mt: 1 }}
                >
                  <Box sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        الإشعارات
                      </Typography>
                      {unreadCount > 0 && (
                        <Chip 
                          label={`${unreadCount} جديد`} 
                          size="small" 
                          color="primary" 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                    
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <MenuItem 
                          key={notification.id}
                          sx={{ 
                            borderLeft: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
                            bgcolor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                            py: 2,
                            borderBottom: 1,
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {notification.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {notification.time}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              {notification.message}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          لا توجد إشعارات جديدة
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Menu>
              </>
            )}

            {/* زر المستخدم أو تسجيل الدخول */}
            {isAuthenticated ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isPremium && !isMobile && (
                    <Chip 
                      label="مميز" 
                      size="small" 
                      color="warning" 
                      icon={<TrendingUp />}
                    />
                  )}
                  <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.name || user?.username}
                      src={user?.avatar}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: `2px solid ${theme.palette.primary.main}`,
                        bgcolor: theme.palette.primary.main
                      }}
                    >
                      {(user?.name || user?.username)?.charAt(0)?.toUpperCase() || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                  {isLargeScreen && (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {user?.name || user?.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.role === 'admin' ? 'مدير' : 'مستخدم'}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  sx={{ mt: 1 }}
                >
                  {/* معلومات المستخدم */}
                  <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {user?.name || user?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user?.email}
                    </Typography>
                    {isPremium && (
                      <Chip 
                        label="حساب مميز" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <Divider />
                  
                  {/* قائمة المستخدم */}
                  {userMenuItems.map((item) => (
                    <MenuItem 
                      key={item.label}
                      onClick={() => {
                        handleUserMenuClose();
                        if (item.path) {
                          navigate(item.path);
                        } else if (item.action) {
                          item.action();
                        }
                      }}
                      sx={{ py: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                        <Box sx={{ color: 'text.secondary' }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2">
                          {item.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: theme.palette.text.primary,
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  تسجيل الدخول
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  إنشاء حساب
                </Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* مساحة احتياطية لشريط التنقل */}
      <Toolbar />

      {/* قائمة الجوال */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{ mt: 1 }}
      >
        {navItems.map((item) => (
          <MenuItem 
            key={item.label}
            onClick={() => {
              handleMobileMenuClose();
              navigate(item.path);
            }}
            sx={{ py: 1.5 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {item.icon}
              <Typography variant="body2">
                {item.label}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        <Divider />
        
        {isAuthenticated ? (
          userMenuItems.map((item) => (
            <MenuItem 
              key={item.label}
              onClick={() => {
                handleMobileMenuClose();
                if (item.path) {
                  navigate(item.path);
                } else if (item.action) {
                  item.action();
                }
              }}
              sx={{ py: 1.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {item.icon}
                <Typography variant="body2">
                  {item.label}
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/login'); }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonIcon />
                <Typography variant="body2">تسجيل الدخول</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/register'); }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Dashboard />
                <Typography variant="body2">إنشاء حساب</Typography>
              </Box>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default Navbar;