export const Severity = {
  CRITICAL: 'CRITICAL',
  MAJOR: 'MAJOR',
  MINOR: 'MINOR',
} as const
export type Severity = (typeof Severity)[keyof typeof Severity]

export const InspectionStatus = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
} as const
export type InspectionStatus = (typeof InspectionStatus)[keyof typeof InspectionStatus]

export const DefectType = {
  WEAVE_DEFECT: 'WEAVE_DEFECT',
  SHADE_VARIATION: 'SHADE_VARIATION',
  HOLE_TEAR: 'HOLE_TEAR',
  COUNT_DEVIATION: 'COUNT_DEVIATION',
  OTHER: 'OTHER',
} as const
export type DefectType = (typeof DefectType)[keyof typeof DefectType]

export type Inspection = {
  id: string
  inspectionDate: string
  machineId: string
  defectType: DefectType
  severity: Severity
  status: InspectionStatus
  remarks: string | null
  resolutionNote: string | null
  createdAt: string
  updatedAt: string
  createdById: string
}

export type InspectionListResult = {
  data: Inspection[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type InspectionFilter = {
  search?: string
  severity?: Severity
  status?: InspectionStatus
  fromDate?: string
  toDate?: string
  page?: number
  limit?: number
  sort?: 'asc' | 'desc'
}

export type CreateInspectionPayload = {
  inspectionDate: string
  machineId: string
  defectType: DefectType
  severity: Severity
  remarks?: string
}

export type UpdateInspectionPayload = Partial<
  Pick<CreateInspectionPayload, 'machineId' | 'defectType' | 'severity' | 'remarks'>
>

export type ResolveInspectionPayload = {
  resolutionNote: string
}
