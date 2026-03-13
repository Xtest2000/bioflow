<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const { taskDetail, isLoading } = storeToRefs(taskStore)

const taskID = computed(() => Number(route.params.id))

function handleBack() {
  router.push('/tasks')
}

function formatStatus(status: string) {
  const statusMap: Record<string, string> = {
    RUNNING: 'primary',
    COMPLETE: 'success',
    SUBMITTED: 'info',
    FAILED: 'danger',
    TERMINATED: 'warning',
    QUEUED: 'warning',
  }
  return statusMap[status] || 'info'
}

onMounted(() => {
  if (taskID.value) {
    taskStore.fetchTaskDetail(taskID.value)
  }
})
</script>

<template>
  <div class="task-detail-page">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="handleBack">返回任务列表</el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/tasks' }">任务列表</el-breadcrumb-item>
        <el-breadcrumb-item>任务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="isLoading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>

    <template v-else-if="taskDetail">
      <div class="task-header">
        <div class="task-title">
          <h1>{{ taskDetail.taskName }}</h1>
          <div class="task-meta">
            <el-tag :type="formatStatus(taskDetail.taskStatus)" size="large">
              {{ taskDetail.taskStatus }}
            </el-tag>
            <span class="tool-info">
              工具：{{ taskDetail.taskToolName }} v{{ taskDetail.taskToolVersion }}
            </span>
          </div>
        </div>
      </div>

      <el-card class="detail-card">
        <template #header>
          <h2>基础信息</h2>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务名称">{{ taskDetail.taskName }}</el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-tag :type="formatStatus(taskDetail.taskStatus)">
              {{ taskDetail.taskStatus }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="工具名称">{{
            taskDetail.taskToolName
          }}</el-descriptions-item>
          <el-descriptions-item label="工具版本">{{
            taskDetail.taskToolVersion
          }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{
            taskDetail.taskSendTime
          }}</el-descriptions-item>
          <el-descriptions-item label="运行时长">{{ taskDetail.taskRunTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ taskDetail.taskEndTime || '未结束' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <h2>执行步骤</h2>
        </template>
        <el-table :data="taskDetail.taskStep" border stripe style="width: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <div class="step-expand">
                <div class="expand-section">
                  <h4>Stdout</h4>
                  <pre class="code-block">{{ props.row.StepStdout || '无输出' }}</pre>
                </div>
                <div class="expand-section">
                  <h4>Stderr</h4>
                  <pre class="code-block">{{ props.row.StepStderr || '无错误' }}</pre>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="StepName" label="步骤名称" />
          <el-table-column prop="StepStartTime" label="开始时间" width="180" />
          <el-table-column prop="StepEndTime" label="结束时间" width="180" />
          <el-table-column prop="StepRunTime" label="运行时长" width="100" />
          <el-table-column label="退出码" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.StepExitCode === 0 ? 'success' : 'danger'">
                {{ scope.row.StepExitCode ?? '-' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <h2>参数列表</h2>
        </template>
        <el-table
          :data="taskDetail.taskParams.filter((p) => p.visible)"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop="name" label="参数名称" width="150" />
          <el-table-column prop="desc" label="描述" />
          <el-table-column prop="value" label="值" width="200" />
        </el-table>
      </el-card>

      <el-card v-if="taskDetail.taskErrorLog" class="detail-card error-card">
        <template #header>
          <h2>错误日志</h2>
        </template>
        <el-alert type="error" :closable="false" show-icon>
          <pre class="error-log">{{ taskDetail.taskErrorLog }}</pre>
        </el-alert>
      </el-card>
    </template>

    <div v-else class="empty-state">
      <el-empty description="任务不存在或获取失败" />
      <el-button type="primary" @click="handleBack">返回任务列表</el-button>
    </div>
  </div>
</template>

<style scoped>
.task-detail-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.loading {
  padding: 40px;
  background: #fff;
  border-radius: 12px;
}

.task-header {
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.task-title h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0 0 16px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tool-info {
  color: #64748b;
  font-size: 14px;
}

.detail-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.detail-card :deep(.el-card__header) {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-card :deep(.el-card__header h2) {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0;
}

.detail-card :deep(.el-card__body) {
  padding: 24px;
}

.error-card {
  border-color: #f56c6c;
}

.error-card :deep(.el-card__header) {
  background: #fef2f2;
}

.step-expand {
  padding: 16px;
  background: #f8fafc;
}

.expand-section {
  margin-bottom: 16px;
}

.expand-section:last-child {
  margin-bottom: 0;
}

.expand-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 8px;
}

.code-block {
  background: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.error-log {
  background: #fef2f2;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  background: #fff;
  border-radius: 12px;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  color: #475569;
}

:deep(.el-descriptions__content) {
  color: #1a1f36;
}
</style>
