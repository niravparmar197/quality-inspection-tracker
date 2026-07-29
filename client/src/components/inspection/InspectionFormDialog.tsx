import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { inspectionsService } from '../../services/inspections.service'
import { DefectType, Severity, type Inspection } from '../../types/inspection'
import { getErrorMessage } from '../../utils/errorMessage'
import { formatEnumLabel } from '../../utils/formatLabel'
import { useSnackbar } from '../../hooks/useSnackbar'
import { isOnline } from '../../utils/network'
import { saveInspectionOffline } from '../../offline/offline.service'
import { getDialogSx } from '../../theme/dialogStyles'

const SEVERITY_OPTIONS = [Severity.MINOR, Severity.MAJOR, Severity.CRITICAL]

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '9px' },
}

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
  onSuccess: (savedOffline: boolean) => void
}

export function InspectionFormDialog({
  open,
  inspection,
  onClose,
  onSuccess,
}: InspectionFormDialogProps) {
  const { showSnackbar } = useSnackbar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
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
        const payload = {
          inspectionDate: values.inspectionDate,
          machineId: values.machineId,
          defectType: values.defectType as DefectType,
          severity: values.severity as Severity,
          remarks: values.remarks || undefined,
        }

        if (isOnline()) {
          await inspectionsService.create(payload)
          onSuccess(false)
          return
        }

        await saveInspectionOffline(payload)
        onSuccess(true)
        return
      }
      onSuccess(false)
    } catch (error) {
      showSnackbar(getErrorMessage(error), 'error')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} sx={getDialogSx(isMobile)}>
      <DialogContent sx={{ p: { xs: 2.75, md: 3.25 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700 }}>
            {isEdit ? 'Edit inspection' : 'New inspection'}
          </Typography>
          <IconButton onClick={onClose} sx={{ bgcolor: '#f1f5f9', width: 30, height: 30 }}>
            <CloseIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <TextField
            label="Machine ID"
            fullWidth
            sx={inputSx}
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
                sx={inputSx}
                error={!!errors.defectType}
                helperText={errors.defectType?.message}
              >
                {Object.values(DefectType).map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatEnumLabel(value)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
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
                  sx={inputSx}
                  error={!!errors.severity}
                  helperText={errors.severity?.message}
                >
                  {SEVERITY_OPTIONS.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              label="Inspection Date"
              type="date"
              fullWidth
              disabled={isEdit}
              sx={inputSx}
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.inspectionDate}
              helperText={errors.inspectionDate?.message}
              {...register('inspectionDate', {
                required: isEdit ? false : 'Inspection date is required',
              })}
            />
          </Box>
          <TextField
            label="Remarks"
            fullWidth
            multiline
            rows={3}
            sx={inputSx}
            {...register('remarks')}
          />

          <Box sx={{ display: 'flex', gap: 1.25, mt: 0.5 }}>
            <Button onClick={onClose} fullWidth variant="outlined" sx={{ borderColor: '#e2e8f0', color: 'text.primary' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
