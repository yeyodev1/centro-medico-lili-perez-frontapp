import APIBase from './httpBase'
import type { DashboardStats } from '@/types'

class DashboardService extends APIBase {
  async stats(): Promise<DashboardStats> {
    const { data } = await this.get<DashboardStats>('dashboard/stats')
    return data
  }
}

export const dashboardService = new DashboardService()
