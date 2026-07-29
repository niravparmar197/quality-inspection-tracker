export type User = {
  id: string
  name: string
  email: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  user: User
}
