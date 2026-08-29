import type { InspectionStatus, Severity } from './inspection'

export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

export type SeverityBreakdown = {
  severity: Severity
  open: number
  resolved: number
  total: number
}

export type DashboardSummary = {
  open: number
  resolved: number
  critical: number
  major: number
  minor: number
  bySeverity: SeverityBreakdown[]
}

export type RecentInspection = {
  id: string
  machineId: string
  severity: Severity
  status: InspectionStatus
  inspectionDate: string
}
