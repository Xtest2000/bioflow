import api from './index'
import type { ServerResources, MockServerResources } from '@/types/server.d'

const isMockMode = import.meta.env.VITE_MOCK_MODE === 'true'

export async function getSourceUsage(): Promise<ServerResources> {
  const response = await api.post<ServerResources>('/analysis/sourceUsage/')
  return response.data
}

export function getMockServerResources(): MockServerResources {
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

export async function fetchServerResources(): Promise<ServerResources> {
  if (isMockMode) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const mockData = getMockServerResources()
    return {
      cpu: mockData.cpu.usage,
      ram: Math.round((mockData.memory.used / mockData.memory.total) * 100),
      disk_data: Math.round((mockData.disk.used / mockData.disk.total) * 100),
      disk_root: Math.round((mockData.disk.used / mockData.disk.total) * 100),
    }
  }

  return getSourceUsage()
}
