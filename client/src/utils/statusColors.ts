import type { InspectionStatus, Severity } from '../types/inspection'

export const severityColor: Record<Severity, 'error' | 'warning' | 'info'> = {
  CRITICAL: 'error',
  MAJOR: 'warning',
  MINOR: 'info',
}

export const statusColor: Record<InspectionStatus, 'warning' | 'success'> = {
  OPEN: 'warning',
  RESOLVED: 'success',
}
