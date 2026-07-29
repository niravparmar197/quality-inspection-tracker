import type { InspectionStatus, Severity } from './inspection'

export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

export type DashboardSummary = {
  open: number
  resolved: number
  critical: number
  major: number
  minor: number
}

export type RecentInspection = {
  id: string
  machineId: string
  severity: Severity
  status: InspectionStatus
  inspectionDate: string
}
