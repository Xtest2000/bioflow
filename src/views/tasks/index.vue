<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import { Refresh, Search, CircleClose, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TaskListItem } from '@/types/task'

const router = useRouter()
const taskStore = useTaskStore()
const { taskList, pagination, filterParams, isLoading } = storeToRefs(taskStore)

// 筛选表单
const searchForm = reactive({
  startTime: '',
  endTime: '',
  taskStatus: '',
  toolName: '',
  taskProject: '',
})

function getStatusType(status: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  // 统一转换为大写进行比较，兼容 API 返回的不同大小写格式
  const statusUpper = status.toUpperCase()
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    RUNNING: 'warning',
    COMPLETE: 'success',
    FAILED: 'danger',
    SUBMITTED: 'info',
    TERMINATED: 'info',
    QUEUED: 'info',
  }
  return map[statusUpper] || 'info'
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handleSearch() {
  taskStore.fetchTaskList({
    pageNum: 1,
    ...searchForm,
  })
}

function handleReset() {
  searchForm.startTime = ''
  searchForm.endTime = ''
  searchForm.taskStatus = ''
  searchForm.toolName = ''
  searchForm.taskProject = ''
  taskStore.fetchTaskList({ pageNum: 1 })
}

function handlePageChange(page: number) {
  taskStore.fetchTaskList({ pageNum: page })
}

function handleSizeChange(size: number) {
  taskStore.fetchTaskList({ pageNum: 1, pageSize: size })
}

function handleViewDetail(row: TaskListItem) {
  router.push(`/tasks/${row.taskID}`)
}

function handleRefresh() {
  taskStore.fetchTaskList({ pageNum: 1 })
}

function canCancel(status: string): boolean {
  return ['RUNNING', 'SUBMITTED', 'QUEUED'].includes(status.toUpperCase())
}

function canDelete(status: string): boolean {
  return [
    'COMPLETE',
    'FAILED',
    'TERMINATED',
    'EXECUTOR_ERROR',
    'SYSTEM_ERROR',
    'CANCELED',
    'SUSPENDED',
  ].includes(status.toUpperCase())
}

async function handleCancel(row: TaskListItem) {
  try {
    await ElMessageBox.confirm(`确定要取消任务「${row.taskName}」吗？`, '取消任务', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const result = await taskStore.cancelTasks([String(row.taskID)])
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // 用户取消操作
  }
}

async function handleDelete(row: TaskListItem) {
  try {
    await ElMessageBox.confirm(
      `确定要删除任务「${row.taskName}」吗？删除后无法恢复。`,
      '删除任务',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const result = await taskStore.deleteTasks([String(row.taskID)])
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  } catch {
    // 用户取消操作
  }
}

onMounted(() => {
  taskStore.fetchTaskList()
})
</script>

<template>
  <div class="tasks-page">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">任务列表</h1>
        <p class="page-subtitle">管理和监控所有任务执行状态</p>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Refresh" :loading="isLoading" @click="handleRefresh">
          刷新
        </el-button>
      </div>
    </div>

    <el-card class="table-card">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">时间范围</label>
            <el-date-picker
              v-model="searchForm.startTime"
              type="datetime"
              placeholder="开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 180px"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">-</label>
            <el-date-picker
              v-model="searchForm.endTime"
              type="datetime"
              placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 180px"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">状态</label>
            <el-select
              v-model="searchForm.taskStatus"
              placeholder="全部状态"
              clearable
              style="width: 120px"
            >
              <el-option label="运行中" value="RUNNING" />
              <el-option label="已完成" value="COMPLETE" />
              <el-option label="已提交" value="SUBMITTED" />
              <el-option label="失败" value="FAILED" />
              <el-option label="已终止" value="TERMINATED" />
              <el-option label="排队中" value="QUEUED" />
            </el-select>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-item">
            <label class="filter-label">工具名称</label>
            <el-input
              v-model="searchForm.toolName"
              placeholder="输入工具名称"
              clearable
              style="width: 180px"
            />
          </div>
          <div class="filter-item">
            <label class="filter-label">项目名称</label>
            <el-input
              v-model="searchForm.taskProject"
              placeholder="输入项目名称"
              clearable
              style="width: 180px"
            />
          </div>
          <div class="filter-item filter-buttons">
            <el-button type="primary" :icon="Search" @click="handleSearch"> 搜索 </el-button>
            <el-button @click="handleReset"> 重置 </el-button>
          </div>
        </div>
      </div>

      <el-table :data="taskList" v-loading="isLoading" fit>
        <el-table-column prop="taskName" label="任务名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="taskStatus" label="状态" width="175" align="center">
          <template #default="{ row }">
            <span class="status-badge" :class="`status-${getStatusType(row.taskStatus)}`">
              {{ row.taskStatus }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="taskToolName"
          label="工具名称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="taskToolVersion" label="工具版本" min-width="100" />
        <el-table-column
          prop="taskProjectName"
          label="项目名称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column prop="taskSendTime" label="提交时间" min-width="160">
          <template #default="{ row }">
            {{ formatTime(row.taskSendTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="taskRunTime" label="运行时间" min-width="100" align="center">
          <template #default="{ row }">
            {{ row.taskRunTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="canCancel(row.taskStatus)"
              type="warning"
              link
              size="small"
              :icon="CircleClose"
              @click="handleCancel(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="canDelete(row.taskStatus)"
              type="danger"
              link
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="filterParams.pageNum"
          v-model:page-size="filterParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination?.total ?? 0"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.tasks-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1f36;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
}

.table-card {
  border-radius: 12px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #64748b;
  white-space: nowrap;
}

.filter-buttons {
  margin-left: auto;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

/* 状态徽章样式 */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.status-warning {
  background: #fef3cd;
  color: #856404;
}

.status-success {
  background: #d4edda;
  color: #155724;
}

.status-danger {
  background: #f8d7da;
  color: #721c24;
}

.status-info {
  background: #e2e3e5;
  color: #383d41;
}

.el-table :deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

.el-table :deep(.el-table th.el-table__cell) {
  background: #fafafa;
  font-weight: 600;
}
</style>
