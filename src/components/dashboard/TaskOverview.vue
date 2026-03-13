<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import type { TaskStatus } from '@/types/task.d'
import { Loading } from '@element-plus/icons-vue'

const taskStore = useTaskStore()
const { statistics, recentTasks, isLoading } = storeToRefs(taskStore)

function getStatusType(status: TaskStatus): '' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<TaskStatus, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    RUNNING: 'warning',
    COMPLETE: 'success',
    FAILED: 'danger',
    SUBMITTED: 'info',
    TERMINATED: 'info',
    QUEUED: 'info',
  }
  return map[status]
}

function getStatusText(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    RUNNING: '运行中',
    COMPLETE: '已完成',
    FAILED: '失败',
    SUBMITTED: '已提交',
    TERMINATED: '已终止',
    QUEUED: '排队中',
  }
  return map[status]
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  taskStore.fetchAll()
})
</script>

<template>
  <el-card class="task-overview" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="title">任务总览</span>
      </div>
    </template>

    <div v-if="isLoading && !statistics" class="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <template v-else>
      <div v-if="statistics" class="statistics-grid">
        <div class="stat-item running">
          <div class="stat-value">{{ statistics.activeTask }}</div>
          <div class="stat-label">运行中</div>
        </div>
        <div class="stat-item completed">
          <div class="stat-value">{{ statistics.doneTask }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-item failed">
          <div class="stat-value">{{ statistics.terminatedTask }}</div>
          <div class="stat-label">已终止</div>
        </div>
        <div class="stat-item pending">
          <div class="stat-value">{{ statistics.queuedTask }}</div>
          <div class="stat-label">排队中</div>
        </div>
      </div>

      <div class="total-task" v-if="statistics">
        <span>总任务数: {{ statistics.totalTask }}</span>
      </div>

      <div class="recent-tasks">
        <div class="section-title">最近任务</div>
        <el-table :data="recentTasks.slice(0, 4)" style="width: 100%" size="small">
          <el-table-column prop="taskName" label="任务名称" min-width="180" />
          <el-table-column prop="taskStatus" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.taskStatus)" size="small">
                {{ getStatusText(row.taskStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="taskSendTime" label="更新时间" width="120">
            <template #default="{ row }">
              {{ formatTime(row.taskSendTime) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
}

.loading .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.stat-item.running .stat-value {
  color: #e6a23c;
}

.stat-item.completed .stat-value {
  color: #67c23a;
}

.stat-item.failed .stat-value {
  color: #f56c6c;
}

.stat-item.pending .stat-value {
  color: #909399;
}

.total-task {
  text-align: center;
  padding: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #606266;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 12px;
}

.recent-tasks {
  margin-top: 16px;
}
</style>
