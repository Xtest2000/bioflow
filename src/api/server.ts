import api from './index'
import type { ServerResources } from '@/types/server.d'

export async function getServerResources(): Promise<ServerResources> {
  const response = await api.get<ServerResources>('/server/resources')
  return response.data
}

export function getMockServerResources(): ServerResources {
  return {
    cpu: {
      usage: Math.floor(Math.random() * 60) + 20,
      cores: 8,
    },
    memory: {
      used: Math.floor(Math.random() * 8) + 4,
      total: 16,
      usage: 0,
    },
    disk: {
      used: Math.floor(Math.random() * 200) + 100,
      total: 500,
      usage: 0,
    },
  }
}
