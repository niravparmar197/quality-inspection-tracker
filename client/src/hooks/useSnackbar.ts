import { createContext, useContext } from 'react'

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning'

export type SnackbarContextValue = {
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void
}

export const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined)

export function useSnackbar() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}
