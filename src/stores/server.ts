import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchServerResources } from '@/api/server'
import type { ServerResources } from '@/types/server.d'

export const useServerStore = defineStore('server', () => {
  const resources = ref<ServerResources | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  async function fetchResources() {
    isLoading.value = true
    error.value = null
    try {
      resources.value = await fetchServerResources()
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
    fetchResources,
    $reset,
  }
})
