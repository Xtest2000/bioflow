import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchTaskStatistics, fetchRecentTasks } from '@/api/task'
import type { TaskStatistics, Task } from '@/types/task.d'

export const useTaskStore = defineStore('task', () => {
  const statistics = ref<TaskStatistics | null>(null)
  const recentTasks = ref<Task[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStatistics() {
    isLoading.value = true
    error.value = null
    try {
      statistics.value = await fetchTaskStatistics()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取任务统计失败'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchRecentTasksList() {
    try {
      recentTasks.value = await fetchRecentTasks()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取最近任务失败'
    }
  }

  async function fetchAll() {
    await Promise.all([fetchStatistics(), fetchRecentTasksList()])
  }

  function $reset() {
    statistics.value = null
    recentTasks.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    statistics,
    recentTasks,
    isLoading,
    error,
    fetchStatistics,
    fetchRecentTasksList,
    fetchAll,
    $reset,
  }
})
