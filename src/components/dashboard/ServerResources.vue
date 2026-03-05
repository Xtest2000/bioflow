<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useServerStore } from '@/stores/server'
import { storeToRefs } from 'pinia'
import UsageChart from '@/components/charts/UsageChart.vue'
import { Loading } from '@element-plus/icons-vue'

const serverStore = useServerStore()
const { resources, isLoading, lastUpdated } = storeToRefs(serverStore)

let refreshTimer: ReturnType<typeof setInterval> | null = null

function startAutoRefresh() {
  refreshTimer = setInterval(() => {
    serverStore.fetchResources()
  }, 5000)
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(() => {
  serverStore.fetchResources()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<template>
  <el-card class="server-resources" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="title">服务器资源监控</span>
        <span v-if="lastUpdated" class="update-time">
          更新于 {{ lastUpdated.toLocaleTimeString() }}
        </span>
      </div>
    </template>

    <div v-if="isLoading && !resources" class="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <div v-else-if="resources" class="resources-grid">
      <UsageChart :usage="resources.cpu" label="CPU 使用率" />
      <UsageChart :usage="resources.ram" label="内存使用率" />
      <UsageChart :usage="resources.disk_root" label="磁盘使用率" />
    </div>

    <div v-else class="empty">
      <el-empty description="暂无数据" />
    </div>
  </el-card>
</template>

<style scoped>
.server-resources {
  height: 100%;
}

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

.update-time {
  font-size: 12px;
  color: #909399;
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

.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}

.empty {
  padding: 20px;
}
</style>
