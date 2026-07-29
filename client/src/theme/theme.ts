import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #eef2f7',
        },
        elevation0: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 9,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 9,
        },
      },
    },
  },
})
