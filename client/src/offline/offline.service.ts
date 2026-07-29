import localforage from 'localforage'
import type { CreateInspectionPayload } from '../types/inspection'

const STORE_KEY = 'offline-inspections'

export async function saveInspectionOffline(payload: CreateInspectionPayload) {
  const items = await getOfflineInspections()
  items.push(payload)
  await localforage.setItem(STORE_KEY, items)
}

export async function getOfflineInspections(): Promise<CreateInspectionPayload[]> {
  const items = await localforage.getItem<CreateInspectionPayload[]>(STORE_KEY)
  return items ?? []
}

export async function replaceOfflineInspections(items: CreateInspectionPayload[]) {
  await localforage.setItem(STORE_KEY, items)
}

export async function removeOfflineInspection(index: number) {
  const items = await getOfflineInspections()
  items.splice(index, 1)
  await replaceOfflineInspections(items)
}
