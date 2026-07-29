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
      }}
    >
      <Paper
        sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 360, mx: 2 }}
        elevation={0}
        variant="outlined"
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Create an Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 3 }}
          >
            Register
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}
