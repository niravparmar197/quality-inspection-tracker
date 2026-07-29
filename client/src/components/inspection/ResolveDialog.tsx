import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useForm } from 'react-hook-form'
import { inspectionsService } from '../../services/inspections.service'
import type { Inspection, ResolveInspectionPayload } from '../../types/inspection'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatEnumLabel } from '../../utils/formatLabel'
import { useSnackbar } from '../../hooks/useSnackbar'
import { getDialogSx } from '../../theme/dialogStyles'

type ResolveDialogProps = {
  open: boolean
  inspection: Inspection | null
  onClose: () => void
  onSuccess: () => void
}

export function ResolveDialog({ open, inspection, onClose, onSuccess }: ResolveDialogProps) {
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResolveInspectionPayload>({ defaultValues: { resolutionNote: '' } })

  const onSubmit = async (values: ResolveInspectionPayload) => {
    if (!inspection) return
    try {
      await inspectionsService.resolve(inspection.id, values)
      reset()
      onSuccess()
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} sx={getDialogSx(isMobile)}>
      <DialogContent sx={{ p: { xs: 2.75, md: 3.25 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Resolve inspection</Typography>
          <IconButton onClick={onClose} sx={{ bgcolor: '#f1f5f9', width: 30, height: 30 }}>
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        {inspection && (
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary', mb: 2 }}>
            Mark{' '}
            <Typography component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
              {inspection.machineId} – {formatEnumLabel(inspection.defectType)}
            </Typography>{' '}
            as resolved and record the fix.
          </Typography>
        )}

        <TextField
          label="Resolution note"
          fullWidth
          multiline
          rows={3}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '9px' } }}
          error={!!errors.resolutionNote}
          helperText={errors.resolutionNote?.message}
          {...register('resolutionNote', {
            required: 'Resolution note is required',
            minLength: { value: 5, message: 'Minimum 5 characters' },
          })}
        />

        <Box sx={{ display: 'flex', gap: 1.25, mt: 2 }}>
          <Button onClick={onClose} fullWidth variant="outlined" sx={{ borderColor: '#e2e8f0', color: 'text.primary' }}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
          >
            Mark resolved
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
