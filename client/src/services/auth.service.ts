import { api } from './api'
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '../types/auth'

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>('/auth/login', payload)
    return data
  },

  async register(payload: RegisterPayload) {
    const { data } = await api.post<User>('/auth/register', payload)
    return data
  },
}
