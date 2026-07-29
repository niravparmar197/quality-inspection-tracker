import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { inspectionsService } from '../../services/inspections.service'
import { DefectType, Severity, type Inspection } from '../../types/inspection'
import { getErrorMessage } from '../../utils/errorMessage'
import { useSnackbar } from '../../hooks/useSnackbar'

type FormValues = {
  inspectionDate: string
  machineId: string
  defectType: DefectType | ''
  severity: Severity | ''
  remarks: string
}

const emptyValues: FormValues = {
  inspectionDate: '',
  machineId: '',
  defectType: '',
  severity: '',
  remarks: '',
}

type InspectionFormDialogProps = {
  open: boolean
  inspection: Inspection | null
  onClose: () => void
  onSuccess: () => void
}

export function InspectionFormDialog({
  open,
  inspection,
  onClose,
  onSuccess,
}: InspectionFormDialogProps) {
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isEdit = inspection !== null
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (open) {
      reset(
        inspection
          ? {
              inspectionDate: inspection.inspectionDate.slice(0, 10),
              machineId: inspection.machineId,
              defectType: inspection.defectType,
              severity: inspection.severity,
              remarks: inspection.remarks ?? '',
            }
          : emptyValues,
      )
    }
  }, [open, inspection, reset])

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await inspectionsService.update(inspection.id, {
          machineId: values.machineId,
          defectType: values.defectType as DefectType,
          severity: values.severity as Severity,
          remarks: values.remarks || undefined,
        })
      } else {
        await inspectionsService.create({
          inspectionDate: values.inspectionDate,
          machineId: values.machineId,
          defectType: values.defectType as DefectType,
          severity: values.severity as Severity,
          remarks: values.remarks || undefined,
        })
      }
      onSuccess()
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <DialogTitle>{isEdit ? 'Edit Inspection' : 'New Inspection'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Inspection Date"
          type="date"
          fullWidth
          margin="normal"
          disabled={isEdit}
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.inspectionDate}
          helperText={errors.inspectionDate?.message}
          {...register('inspectionDate', {
            required: isEdit ? false : 'Inspection date is required',
          })}
        />
        <TextField
          label="Machine ID"
          fullWidth
          margin="normal"
          error={!!errors.machineId}
          helperText={errors.machineId?.message}
          {...register('machineId', { required: 'Machine ID is required' })}
        />
        <Controller
          name="defectType"
          control={control}
          rules={{ required: 'Defect type is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Defect Type"
              fullWidth
              margin="normal"
              error={!!errors.defectType}
              helperText={errors.defectType?.message}
            >
              {Object.values(DefectType).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="severity"
          control={control}
          rules={{ required: 'Severity is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Severity"
              fullWidth
              margin="normal"
              error={!!errors.severity}
              helperText={errors.severity?.message}
            >
              {Object.values(Severity).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <TextField
          label="Remarks"
          fullWidth
          multiline
          rows={2}
          margin="normal"
          {...register('remarks')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isEdit ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
