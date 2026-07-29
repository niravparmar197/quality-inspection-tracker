import { api } from './api'
import type {
  CreateInspectionPayload,
  Inspection,
  InspectionFilter,
  InspectionListResult,
  ResolveInspectionPayload,
  UpdateInspectionPayload,
} from '../types/inspection'

export const inspectionsService = {
  async findAll(filter: InspectionFilter) {
    const { data } = await api.get<InspectionListResult>('/inspections', {
      params: filter,
    })
    return data
  },

  async findOne(id: string) {
    const { data } = await api.get<Inspection>(`/inspections/${id}`)
    return data
  },

  async create(payload: CreateInspectionPayload) {
    const { data } = await api.post<Inspection>('/inspections', payload)
    return data
  },

  async update(id: string, payload: UpdateInspectionPayload) {
    const { data } = await api.patch<Inspection>(`/inspections/${id}`, payload)
    return data
  },

  async resolve(id: string, payload: ResolveInspectionPayload) {
    const { data } = await api.patch<Inspection>(`/inspections/${id}/resolve`, payload)
    return data
  },

  async remove(id: string) {
    await api.delete(`/inspections/${id}`)
  },
}
