import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useForm } from 'react-hook-form'
import { inspectionsService } from '../../services/inspections.service'
import type { Inspection, ResolveInspectionPayload } from '../../types/inspection'
import { getErrorMessage } from '../../utils/errorMessage'
import { useSnackbar } from '../../hooks/useSnackbar'

type ResolveDialogProps = {
  open: boolean
  inspection: Inspection | null
  onClose: () => void
  onSuccess: () => void
}

export function ResolveDialog({ open, inspection, onClose, onSuccess }: ResolveDialogProps) {
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>Resolve Inspection</DialogTitle>
      <DialogContent>
        <TextField
          label="Resolution Note"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          error={!!errors.resolutionNote}
          helperText={errors.resolutionNote?.message}
          {...register('resolutionNote', {
            required: 'Resolution note is required',
            minLength: { value: 5, message: 'Minimum 5 characters' },
          })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
          Resolve
        </Button>
      </DialogActions>
    </Dialog>
  )
}
