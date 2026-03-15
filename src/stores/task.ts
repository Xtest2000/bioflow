import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  fetchTaskStatistics,
  fetchRecentTasks,
  getTaskList,
  getTaskDetail,
  fetchCancelTask,
  fetchDeleteTask,
} from '@/api/task'
import type {
  TaskStatistics,
  TaskListItem,
  TaskDetail,
  Pagination,
  TaskListParams,
} from '@/types/task.d'

export const useTaskStore = defineStore('task', () => {
  const statistics = ref<TaskStatistics | null>(null)
  const recentTasks = ref<TaskListItem[]>([])
  const taskList = ref<TaskListItem[]>([])
  const taskDetail = ref<TaskDetail | null>(null)
  const pagination = ref<Pagination | null>(null)
  const filterParams = ref<TaskListParams>({
    pageNum: 1,
    pageSize: 10,
  })
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

  async function fetchTaskList(params?: Partial<TaskListParams>) {
    isLoading.value = true
    error.value = null

    const requestParams: TaskListParams = {
      ...filterParams.value,
      ...params,
    }

    filterParams.value = requestParams

    try {
      const response = await getTaskList(requestParams)
      taskList.value = response.tasks
      pagination.value = response.pagination
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取任务列表失败'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTaskDetail(taskID: number) {
    isLoading.value = true
    error.value = null
    try {
      taskDetail.value = await getTaskDetail(taskID)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取任务详情失败'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAll() {
    await Promise.all([fetchStatistics(), fetchRecentTasksList(), fetchTaskList()])
  }

  async function cancelTasks(taskIds: string[]) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetchCancelTask({ taskIds })
      if (response.task_status === 200) {
        await fetchTaskList()
        return { success: true, message: '任务取消成功' }
      }
      throw new Error('取消任务失败')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '取消任务失败'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTasks(taskIds: string[]) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetchDeleteTask({ taskIds })
      if (response.task_status === 200) {
        await fetchTaskList()
        return { success: true, message: '任务删除成功' }
      }
      throw new Error('删除任务失败')
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除任务失败'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function $reset() {
    statistics.value = null
    recentTasks.value = []
    taskList.value = []
    taskDetail.value = null
    pagination.value = null
    filterParams.value = {
      pageNum: 1,
      pageSize: 10,
    }
    isLoading.value = false
    error.value = null
  }

  return {
    statistics,
    recentTasks,
    taskList,
    taskDetail,
    pagination,
    filterParams,
    isLoading,
    error,
    fetchStatistics,
    fetchRecentTasksList,
    fetchTaskList,
    fetchTaskDetail,
    fetchAll,
    cancelTasks,
    deleteTasks,
    $reset,
  }
})
