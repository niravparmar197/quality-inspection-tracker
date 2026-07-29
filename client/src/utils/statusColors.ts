import type { InspectionStatus, Severity } from '../types/inspection'

export const severityColor: Record<Severity, string> = {
  CRITICAL: 'bg-red-50 text-red-600',
  MAJOR: 'bg-amber-50 text-amber-700',
  MINOR: 'bg-blue-50 text-blue-700',
}

export const statusColor: Record<InspectionStatus, string> = {
  OPEN: 'bg-amber-50 text-amber-700',
  RESOLVED: 'bg-green-50 text-green-700',
}
