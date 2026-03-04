import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchToolList } from '@/api/tool'
import type { Tool, ToolListParams } from '@/types/tool.d'

export const useToolStore = defineStore('tool', () => {
  const tools = ref<Tool[]>([])
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const searchName = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTools(pageNum = 1, pageSize = 10) {
    isLoading.value = true
    error.value = null
    try {
      const params: ToolListParams = {
        pageNum,
        pageSize,
      }
      if (searchName.value) {
        params.toolName = searchName.value
      }
      const response = await fetchToolList(params)
      tools.value = response.tools
      pagination.value = {
        currentPage: response.pagination.currentPage,
        pageSize: Number(response.pagination.pageSize),
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取工具列表失败'
    } finally {
      isLoading.value = false
    }
  }

  function setSearchName(name: string) {
    searchName.value = name
  }

  function $reset() {
    tools.value = []
    pagination.value = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    }
    searchName.value = ''
    isLoading.value = false
    error.value = null
  }

  return {
    tools,
    pagination,
    searchName,
    isLoading,
    error,
    fetchTools,
    setSearchName,
    $reset,
  }
})
