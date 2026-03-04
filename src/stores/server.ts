import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getMockServerResources } from '@/api/server'
import type { ServerResources } from '@/types/server.d'

export const useServerStore = defineStore('server', () => {
  const resources = ref<ServerResources | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  const cpuUsage = computed(() => resources.value?.cpu.usage ?? 0)
  const memoryUsage = computed(() => {
    if (!resources.value?.memory) return 0
    return Math.round((resources.value.memory.used / resources.value.memory.total) * 100)
  })
  const diskUsage = computed(() => {
    if (!resources.value?.disk) return 0
    return Math.round((resources.value.disk.used / resources.value.disk.total) * 100)
  })

  async function fetchResources() {
    isLoading.value = true
    error.value = null
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const data = getMockServerResources()
      if (data.memory.usage === 0) {
        data.memory.usage = Math.round((data.memory.used / data.memory.total) * 100)
      }
      if (data.disk.usage === 0) {
        data.disk.usage = Math.round((data.disk.used / data.disk.total) * 100)
      }
      resources.value = data
      lastUpdated.value = new Date()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取服务器资源失败'
    } finally {
      isLoading.value = false
    }
  }

  function $reset() {
    resources.value = null
    isLoading.value = false
    error.value = null
    lastUpdated.value = null
  }

  return {
    resources,
    isLoading,
    error,
    lastUpdated,
    cpuUsage,
    memoryUsage,
    diskUsage,
    fetchResources,
    $reset,
  }
})
