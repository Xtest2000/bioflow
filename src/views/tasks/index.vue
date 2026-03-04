<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import { storeToRefs } from 'pinia'
import { Refresh, Search } from '@element-plus/icons-vue'

const taskStore = useTaskStore()
const { statistics, recentTasks, isLoading } = storeToRefs(taskStore)

const searchText = ref('')
const statusFilter = ref('')

function getStatusType(status: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    running: 'warning',
    completed: 'success',
    failed: 'danger',
    pending: 'info',
  }
  return map[status] || 'info'
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    running: '运行中',
    completed: '已完成',
    failed: '失败',
    pending: '等待中',
  }
  return map[status] || '未知'
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

function handleRefresh() {
  taskStore.fetchAll()
}

onMounted(() => {
  taskStore.fetchAll()
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

    <div v-if="statistics" class="stats-cards">
      <div class="stat-card running">
        <div class="stat-value">{{ statistics.running }}</div>
        <div class="stat-label">运行中</div>
      </div>
      <div class="stat-card completed">
        <div class="stat-value">{{ statistics.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card failed">
        <div class="stat-value">{{ statistics.failed }}</div>
        <div class="stat-label">失败</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-value">{{ statistics.pending }}</div>
        <div class="stat-label">等待中</div>
      </div>
    </div>

    <el-card class="table-card">
      <div class="table-toolbar">
        <el-input
          v-model="searchText"
          placeholder="搜索任务名称"
          :prefix-icon="Search"
          clearable
          style="width: 240px"
        />
        <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 140px">
          <el-option label="运行中" value="running" />
          <el-option label="已完成" value="completed" />
          <el-option label="失败" value="failed" />
          <el-option label="等待中" value="pending" />
        </el-select>
      </div>

      <el-table :data="recentTasks" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="name" label="任务名称" min-width="200" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

.stat-card.running .stat-value {
  color: #e6a23c;
}

.stat-card.completed .stat-value {
  color: #67c23a;
}

.stat-card.failed .stat-value {
  color: #f56c6c;
}

.stat-card.pending .stat-value {
  color: #909399;
}

.table-card {
  border-radius: 12px;
}

.table-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
