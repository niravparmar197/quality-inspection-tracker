import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useMemo, useState, type ReactNode } from 'react'
import { SnackbarContext, type SnackbarSeverity } from '../hooks/useSnackbar'

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<SnackbarSeverity>('info')

  const value = useMemo(
    () => ({
      showSnackbar: (msg: string, sev: SnackbarSeverity = 'info') => {
        setMessage(msg)
        setSeverity(sev)
        setOpen(true)
      },
    }),
    [],
  )

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}
