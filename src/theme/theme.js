import { createTheme } from '@mui/material/styles';

// Custom CRM Theme with modern professional colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2027',
      secondary: '#637381',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.08)',
    '0px 2px 6px rgba(0, 0, 0, 0.1)',
    '0px 4px 12px rgba(0, 0, 0, 0.12)',
    '0px 6px 16px rgba(0, 0, 0, 0.14)',
    '0px 8px 24px rgba(0, 0, 0, 0.16)',
    '0px 12px 32px rgba(0, 0, 0, 0.18)',
    '0px 16px 40px rgba(0, 0, 0, 0.2)',
    '0px 20px 48px rgba(0, 0, 0, 0.22)',
    '0px 24px 56px rgba(0, 0, 0, 0.24)',
    '0px 28px 64px rgba(0, 0, 0, 0.26)',
    '0px 32px 72px rgba(0, 0, 0, 0.28)',
    '0px 36px 80px rgba(0, 0, 0, 0.3)',
    '0px 40px 88px rgba(0, 0, 0, 0.32)',
    '0px 44px 96px rgba(0, 0, 0, 0.34)',
    '0px 48px 104px rgba(0, 0, 0, 0.36)',
    '0px 52px 112px rgba(0, 0, 0, 0.38)',
    '0px 56px 120px rgba(0, 0, 0, 0.4)',
    '0px 60px 128px rgba(0, 0, 0, 0.42)',
    '0px 64px 136px rgba(0, 0, 0, 0.44)',
    '0px 68px 144px rgba(0, 0, 0, 0.46)',
    '0px 72px 152px rgba(0, 0, 0, 0.48)',
    '0px 76px 160px rgba(0, 0, 0, 0.5)',
    '0px 80px 168px rgba(0, 0, 0, 0.52)',
    '0px 84px 176px rgba(0, 0, 0, 0.54)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#1976d2',
            color: '#ffffff',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
