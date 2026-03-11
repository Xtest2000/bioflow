import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import {
  fetchToolList,
  fetchToolDetail as fetchToolDetailApi,
  addTool as addToolApi,
  deleteTool as deleteToolApi,
} from '@/api/tool'
import type {
  Tool,
  ToolListParams,
  ToolDetail,
  ToolDetailParams,
  DeleteToolResponse,
} from '@/types/tool.d'

export const useToolStore = defineStore('tool', () => {
  const tools = ref<Tool[]>([])
  const currentToolDetail = ref<ToolDetail | null>(null)
  const pagination = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })
  const searchName = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const addDialogVisible = ref(false)
  const deleteDialogVisible = ref(false)
  const selectedToolId = ref<number | null>(null)
  const addPackagePath = ref('')

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

  function openAddDialog() {
    addDialogVisible.value = true
    addPackagePath.value = ''
  }

  function closeAddDialog() {
    addDialogVisible.value = false
    addPackagePath.value = ''
  }

  function openDeleteDialog(toolId: number) {
    selectedToolId.value = toolId
    deleteDialogVisible.value = true
  }

  function closeDeleteDialog() {
    deleteDialogVisible.value = false
    selectedToolId.value = null
  }

  async function handleAddTool() {
    if (!addPackagePath.value.trim()) {
      error.value = '请填写工具包路径'
      return
    }

    isLoading.value = true
    error.value = null
    try {
      await addToolApi({ packagePath: addPackagePath.value })
      await fetchTools()
      closeAddDialog()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '添加工具失败'
    } finally {
      isLoading.value = false
    }
  }

  async function handleDeleteTool() {
    if (!selectedToolId.value) return

    isLoading.value = true
    error.value = null
    try {
      const response: DeleteToolResponse = await deleteToolApi(selectedToolId.value)
      if (response.code === 200) {
        await fetchTools()
        closeDeleteDialog()
        ElMessage.success('删除成功')
      } else {
        throw new Error(response.message || '删除失败')
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除工具失败'
      ElMessage.error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchToolDetail(params: ToolDetailParams) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetchToolDetailApi(params)
      currentToolDetail.value = response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取工具详情失败'
    } finally {
      isLoading.value = false
    }
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
    currentToolDetail,
    pagination,
    searchName,
    isLoading,
    error,
    addDialogVisible,
    deleteDialogVisible,
    selectedToolId,
    addPackagePath,
    fetchTools,
    fetchToolDetail,
    setSearchName,
    openAddDialog,
    closeAddDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleAddTool,
    handleDeleteTool,
    $reset,
  }
})
