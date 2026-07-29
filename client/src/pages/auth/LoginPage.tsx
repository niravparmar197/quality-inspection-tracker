import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { LoginPayload } from '../../types/auth'

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px' },
}

export default function LoginPage() {
  usePageTitle('Login')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>()

  const onSubmit = async (values: LoginPayload) => {
    setServerError(null)
    try {
      await login(values)
      navigate('/dashboard', { replace: true })
    } catch {
      setServerError('Invalid email or password')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 7,
          color: '#fff',
          background: 'linear-gradient(160deg, #1d4ed8, #1e3a8a)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            QI
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>Quality Inspection Tracker</Typography>
        </Box>
        <Box sx={{ maxWidth: 420 }}>
          <Typography sx={{ fontSize: 30, fontWeight: 800, lineHeight: 1.25, mb: 2 }}>
            Catch defects before they leave the floor.
          </Typography>
          <Typography sx={{ fontSize: 15, color: '#c7d2fe', lineHeight: 1.6 }}>
            Log inspections, track severity, and resolve issues — online or offline — from a single
            dashboard.
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 13, color: '#93c5fd' }}>© 2026 Quality Inspection Tracker</Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.25,
              mb: 4.5,
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: '10px',
                bgcolor: 'primary.main',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              QI
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 17 }}>Quality Inspection Tracker</Typography>
          </Box>

          <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.5 }}>Sign in</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3.5 }}>
            Welcome back. Enter your details to continue.
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              fullWidth
              sx={inputSx}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={inputSx}
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />
            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ py: 1.4 }}>
              Sign in
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 3, fontSize: 13.5, color: 'text.secondary' }}>
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ fontWeight: 600 }}>
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
