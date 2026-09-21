import APIBase from './httpBase'
import type { AccountType, StaffUser } from '@/types'

export interface StaffUserCreate {
  name: string
  email: string
  password: string
  phone?: string
  accountType: AccountType
}

export interface StaffUserUpdate {
  name?: string
  phone?: string
  accountType?: AccountType
  isActive?: boolean
  password?: string
}

class UserService extends APIBase {
  async list(): Promise<StaffUser[]> {
    const { data } = await this.get<StaffUser[]>('users')
    return data
  }

  async create(input: StaffUserCreate): Promise<StaffUser> {
    const { data } = await this.post<StaffUser>('users', input)
    return data
  }

  async update(id: string, input: StaffUserUpdate): Promise<StaffUser> {
    const { data } = await this.put<StaffUser>(`users/${id}`, input)
    return data
  }
}

export const userService = new UserService()
