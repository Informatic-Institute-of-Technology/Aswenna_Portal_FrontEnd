import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6B8E23', 
      light: '#8FA887',
      dark: '#5A7519',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7C9473',
      light: '#A4B89B',
      dark: '#6A7F62',
    },
    background: {
      default: '#0f0f0f',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#3a3a3a',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          '& .MuiInput-underline:before': {
            borderBottomColor: '#777',
            borderBottomWidth: '1px',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#6B8E23',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#6B8E23',
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#b0b0b0',
            opacity: 1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a2a',
          border: '1px solid #3a3a3a',
          borderRadius: '12px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(107, 142, 35, 0.1)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #3a3a3a',
          width: 280,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderLeft: '3px solid transparent',
          '&:hover': {
            backgroundColor: 'rgba(107, 142, 35, 0.1)',
            borderLeftColor: '#6B8E23',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(107, 142, 35, 0.2)',
            borderLeftColor: '#6B8E23',
            '&:hover': {
              backgroundColor: 'rgba(107, 142, 35, 0.3)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#6B8E23',
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#f44336',
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
  },
});
