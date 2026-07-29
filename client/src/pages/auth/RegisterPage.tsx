import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { getErrorMessage } from '../../utils/errorMessage'
import { useSnackbar } from '../../hooks/useSnackbar'
import { usePageTitle } from '../../hooks/usePageTitle'
import type { RegisterPayload } from '../../types/auth'

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '10px' },
}

export default function RegisterPage() {
  usePageTitle('Register')
  const { showSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>()

  const onSubmit = async (values: RegisterPayload) => {
    try {
      await authService.register(values)
      showSnackbar('Registration successful. Please login.', 'success')
      navigate('/login', { replace: true })
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 4.5 }, width: '100%', maxWidth: 400, borderRadius: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3.5, justifyContent: 'center' }}>
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

        <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.5 }}>Create account</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mb: 3 }}>
          Set up access for your inspection team.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <TextField
            label="Full name"
            fullWidth
            sx={inputSx}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
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
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />
          <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} sx={{ mt: 0.5, py: 1.4 }}>
            Create account
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2.75, fontSize: 13.5, color: 'text.secondary' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" sx={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
