import { inspectionsService } from '../services/inspections.service'
import { getOfflineInspections, replaceOfflineInspections } from './offline.service'
import type { CreateInspectionPayload } from '../types/inspection'

export const OFFLINE_SYNCED_EVENT = 'offline:synced'

export async function syncOfflineData(): Promise<number> {
  const items = await getOfflineInspections()
  if (items.length === 0) return 0

  const remaining: CreateInspectionPayload[] = []
  let syncedCount = 0

  for (const item of items) {
    try {
      await inspectionsService.create(item)
      syncedCount += 1
    } catch {
      remaining.push(item)
    }
  }

  await replaceOfflineInspections(remaining)

  if (syncedCount > 0) {
    window.dispatchEvent(new CustomEvent(OFFLINE_SYNCED_EVENT))
  }

  return syncedCount
}
