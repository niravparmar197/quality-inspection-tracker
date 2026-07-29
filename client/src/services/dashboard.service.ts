import { api } from './api'
import type { ApiEnvelope, DashboardSummary, RecentInspection } from '../types/dashboard'

export const dashboardService = {
  async getSummary() {
    const { data } = await api.get<ApiEnvelope<DashboardSummary>>('/dashboard/summary')
    return data.data
  },

  async getRecent(limit = 5) {
    const { data } = await api.get<ApiEnvelope<RecentInspection[]>>('/dashboard/recent', {
      params: { limit },
    })
    return data.data
  },
}
