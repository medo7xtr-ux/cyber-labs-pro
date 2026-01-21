import { createTheme, alpha } from '@mui/material/styles';

/**
 * نظام الثيمات المتكامل لـ CyberLabs
 * يدعم الوضعين (فاتح/داكن) والتخصيص المتقدم
 */

// الألوان الأساسية
const primaryColors = {
  main: '#1976d2',
  light: '#42a5f5',
  dark: '#1565c0',
  contrastText: '#ffffff'
};

const secondaryColors = {
  main: '#9c27b0',
  light: '#ba68c8',
  dark: '#7b1fa2',
  contrastText: '#ffffff'
};

const successColors = {
  main: '#2e7d32',
  light: '#4caf50',
  dark: '#1b5e20',
  contrastText: '#ffffff'
};

const warningColors = {
  main: '#ed6c02',
  light: '#ff9800',
  dark: '#e65100',
  contrastText: '#ffffff'
};

const errorColors = {
  main: '#d32f2f',
  light: '#ef5350',
  dark: '#c62828',
  contrastText: '#ffffff'
};

const infoColors = {
  main: '#0288d1',
  light: '#03a9f4',
  dark: '#01579b',
  contrastText: '#ffffff'
};

// الثيم الأساسي (الوضع الفاتح)
const lightTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: primaryColors,
    secondary: secondaryColors,
    success: successColors,
    warning: warningColors,
    error: errorColors,
    info: infoColors,
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
      subtle: alpha('#1976d2', 0.02)
    },
    text: {
      primary: '#1a2027',
      secondary: '#5f6b7a',
      disabled: '#a0aec0'
    },
    divider: alpha('#1a2027', 0.12),
    action: {
      active: alpha('#1a2027', 0.54),
      hover: alpha('#1976d2', 0.04),
      selected: alpha('#1976d2', 0.08),
      disabled: alpha('#1a2027', 0.26),
      disabledBackground: alpha('#1a2027', 0.12)
    }
  },
  typography: {
    fontFamily: [
      'Cairo',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em'
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.00833em'
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.2,
      letterSpacing: '0em'
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '0.00735em'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '0em'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '0.0075em'
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em'
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em'
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em'
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em'
    },
    button: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none'
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em'
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase'
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.07)',
    '0 8px 16px rgba(0,0,0,0.09)',
    '0 12px 24px rgba(0,0,0,0.11)',
    '0 16px 32px rgba(0,0,0,0.13)',
    '0 20px 40px rgba(0,0,0,0.15)',
    '0 24px 48px rgba(0,0,0,0.17)',
    '0 28px 56px rgba(0,0,0,0.19)',
    '0 32px 64px rgba(0,0,0,0.21)',
    '0 36px 72px rgba(0,0,0,0.23)',
    '0 40px 80px rgba(0,0,0,0.25)',
    '0 44px 88px rgba(0,0,0,0.27)',
    '0 48px 96px rgba(0,0,0,0.29)',
    '0 52px 104px rgba(0,0,0,0.31)',
    '0 56px 112px rgba(0,0,0,0.33)',
    '0 60px 120px rgba(0,0,0,0.35)',
    '0 64px 128px rgba(0,0,0,0.37)',
    '0 68px 136px rgba(0,0,0,0.39)',
    '0 72px 144px rgba(0,0,0,0.41)',
    '0 76px 152px rgba(0,0,0,0.43)',
    '0 80px 160px rgba(0,0,0,0.45)',
    '0 84px 168px rgba(0,0,0,0.47)',
    '0 88px 176px rgba(0,0,0,0.49)',
    '0 92px 184px rgba(0,0,0,0.51)'
  ],
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
  },
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '10px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '5px',
            '&:hover': {
              background: '#555'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        },
        contained: {
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)'
          }
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2
          }
        },
        sizeLarge: {
          fontSize: '1.1rem',
          padding: '12px 24px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        },
        outlined: {
          borderColor: alpha('#1a2027', 0.12)
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(primaryColors.main, 0.1)}`
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColors.light
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColors.main,
            borderWidth: 2
          }
        },
        notchedOutline: {
          borderColor: alpha('#1a2027', 0.23)
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        },
        outlined: {
          borderWidth: 1.5
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 'bold'
        }
      }
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 'bold'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animationDuration: '0.8s'
        }
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          alignItems: 'center'
        },
        icon: {
          alignItems: 'center'
        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontWeight: 500
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          '&.Mui-selected': {
            fontWeight: 700
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0'
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: 0
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700,
            backgroundColor: alpha('#1976d2', 0.03)
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#1976d2', 0.02)
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: alpha('#1a2027', 0.08)
        },
        head: {
          fontWeight: 700
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: 0
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-expanded': {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        }
      }
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 600
          }
        }
      }
    },
    MuiRating: {
      styleOverrides: {
        root: {
          '& .MuiRating-iconFilled': {
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          '& .MuiSpeedDialAction-fab': {
            backgroundColor: '#ffffff',
            color: primaryColors.main,
            '&:hover': {
              backgroundColor: alpha(primaryColors.main, 0.1)
            }
          }
        }
      }
    }
  }
});

// الثيم الداكن
const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    success: {
      main: '#66bb6a',
      light: '#e8f5e9',
      dark: '#388e3c',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    warning: {
      main: '#ffa726',
      light: '#fff3e0',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    error: {
      main: '#f44336',
      light: '#ffebee',
      dark: '#d32f2f',
      contrastText: '#ffffff'
    },
    info: {
      main: '#29b6f6',
      light: '#e1f5fe',
      dark: '#0288d1',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
      subtle: alpha('#ffffff', 0.05)
    },
    text: {
      primary: '#ffffff',
      secondary: alpha('#ffffff', 0.7),
      disabled: alpha('#ffffff', 0.5)
    },
    divider: alpha('#ffffff', 0.12),
    action: {
      active: '#ffffff',
      hover: alpha('#ffffff', 0.08),
      selected: alpha('#ffffff', 0.16),
      disabled: alpha('#ffffff', 0.3),
      disabledBackground: alpha('#ffffff', 0.12)
    }
  },
  components: {
    ...lightTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '10px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#2d2d2d'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#555',
            borderRadius: '5px',
            '&:hover': {
              background: '#777'
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#252525',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: alpha('#ffffff', 0.05)
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#ffffff', 0.05)
          }
        }
      }
    }
  }
});

// دالة للحصول على الثيم المناسب
const getTheme = (mode = 'light') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

// دوال مساعدة للألوان
const getColor = (colorName, theme) => {
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main
  };
  return colors[colorName] || theme.palette.primary.main;
};

const getGradient = (color1, color2, direction = '45deg') => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

// أنماط CSS مشتركة
const globalStyles = {
  // أنماط النص
  textGradient: (color1, color2) => ({
    background: `linear-gradient(45deg, ${color1}, ${color2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }),
  
  // أنماط الظلال
  softShadow: (color = '#000', opacity = 0.1) => ({
    boxShadow: `0 4px 12px ${alpha(color, opacity)}`
  }),
  
  // أنماط الحدود
  gradientBorder: (color1, color2, width = 2) => ({
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      padding: width,
      background: `linear-gradient(45deg, ${color1}, ${color2})`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude'
    }
  }),
  
  // أنماط التحريك
  fadeIn: {
    animation: 'fadeIn 0.5s ease-in-out',
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 }
    }
  },
  
  slideInUp: {
    animation: 'slideInUp 0.3s ease-out',
    '@keyframes slideInUp': {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 }
    }
  },
  
  pulse: {
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.5 },
      '100%': { opacity: 1 }
    }
  }
};

// التصدير
export { lightTheme, darkTheme, getTheme, getColor, getGradient, globalStyles };
export default getTheme;