import { createTheme, alpha } from '@mui/material/styles';

/**
 * نظام الثيمات المتطور لـ CyberLabs
 * تصميم عصري يركز على تجربة المستخدم والاحترافية
 */

const primaryColors = {
  main: '#0061FF', // أزرق عصري
  light: '#4D91FF',
  dark: '#0047BB',
  contrastText: '#ffffff'
};

const secondaryColors = {
  main: '#6C63FF', // بنفسجي تقني
  light: '#8F89FF',
  dark: '#4B44CC',
  contrastText: '#ffffff'
};

const darkPalette = {
  mode: 'dark',
  primary: primaryColors,
  secondary: secondaryColors,
  background: {
    default: '#0A1929', // كحلي غامق جداً
    paper: '#102031',
    subtle: alpha('#0061FF', 0.05)
  },
  text: {
    primary: '#ffffff',
    secondary: '#B2BAC2',
  },
  divider: alpha('#ffffff', 0.1),
};

const lightPalette = {
  mode: 'light',
  primary: primaryColors,
  secondary: secondaryColors,
  background: {
    default: '#F3F6F9',
    paper: '#ffffff',
    subtle: alpha('#0061FF', 0.02)
  },
  text: {
    primary: '#1A2027',
    secondary: '#5F6B7A',
  },
  divider: alpha('#1A2027', 0.08),
};

const getTheme = (mode) => createTheme({
  direction: 'rtl',
  palette: mode === 'dark' ? darkPalette : lightPalette,
  typography: {
    fontFamily: 'Cairo, sans-serif',
    h1: { fontWeight: 800, fontSize: '3rem' },
    h2: { fontWeight: 700, fontSize: '2.25rem' },
    h3: { fontWeight: 700, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1.1rem' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${primaryColors.main} 30%, ${primaryColors.light} 90%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid',
          borderColor: mode === 'dark' ? alpha('#ffffff', 0.05) : alpha('#000000', 0.05),
          '&:hover': {
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? alpha('#102031', 0.8) : alpha('#ffffff', 0.8),
          backdropFilter: 'blur(12px)',
          color: mode === 'dark' ? '#ffffff' : '#1A2027',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: mode === 'dark' ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05),
        },
      },
    },
  },
});

export default getTheme;
