<script setup lang="ts">
import { ref } from 'vue'
import { Monitor, DataAnalysis, Document, Setting } from '@element-plus/icons-vue'

const tools = ref([
  {
    id: '1',
    name: '服务器监控',
    description: '实时监控服务器性能指标，包括 CPU、内存、磁盘使用情况',
    icon: Monitor,
    category: '运维工具',
    status: 'active',
  },
  {
    id: '2',
    name: '数据分析',
    description: '强大的数据分析工具，支持多种数据源和可视化图表',
    icon: DataAnalysis,
    category: '分析工具',
    status: 'active',
  },
  {
    id: '3',
    name: '报表生成',
    description: '自动化报表生成工具，支持定时任务和多格式导出',
    icon: Document,
    category: '报表工具',
    status: 'active',
  },
  {
    id: '4',
    name: '系统配置',
    description: '系统参数配置管理，支持动态调整运行参数',
    icon: Setting,
    category: '系统工具',
    status: 'maintenance',
  },
])

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    active: '可用',
    maintenance: '维护中',
    disabled: '已禁用',
  }
  return map[status] || '未知'
}

function getStatusType(status: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    active: 'success',
    maintenance: 'warning',
    disabled: 'info',
  }
  return map[status] || 'info'
}
</script>

<template>
  <div class="tools-page">
    <div class="page-header">
      <h1 class="page-title">工具库</h1>
      <p class="page-subtitle">选择您需要的工具开始工作</p>
    </div>

    <div class="tools-grid">
      <el-card
        v-for="tool in tools"
        :key="tool.id"
        class="tool-card"
        shadow="hover"
        :body-style="{ padding: '24px' }"
      >
        <div class="tool-icon">
          <el-icon :size="40"><component :is="tool.icon" /></el-icon>
        </div>
        <div class="tool-info">
          <div class="tool-header">
            <h3 class="tool-name">{{ tool.name }}</h3>
            <el-tag :type="getStatusType(tool.status)" size="small">
              {{ getStatusText(tool.status) }}
            </el-tag>
          </div>
          <p class="tool-category">{{ tool.category }}</p>
          <p class="tool-desc">{{ tool.description }}</p>
        </div>
        <div class="tool-actions">
          <el-button type="primary" :disabled="tool.status !== 'active'"> 立即使用 </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.tools-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
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

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.tool-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.tool-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 16px;
}

.tool-info {
  margin-bottom: 16px;
}

.tool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tool-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0;
}

.tool-category {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.tool-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

.tool-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
