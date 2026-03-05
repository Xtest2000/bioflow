<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToolStore } from '@/stores/tool'
import { storeToRefs } from 'pinia'
import { ArrowLeft, Loading, Box } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const toolStore = useToolStore()
const { currentToolDetail, isLoading } = storeToRefs(toolStore)

const toolID = computed(() => Number(route.params.id))
const version = computed(() => (route.query.version as string) || '')

function handleBack() {
  router.push('/tools')
}

onMounted(() => {
  if (toolID.value && version.value) {
    toolStore.fetchToolDetail({ toolID: toolID.value, version: version.value })
  }
})
</script>

<template>
  <div class="tool-detail-page">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="handleBack">返回工具库</el-button>
    </div>

    <div v-if="isLoading" class="loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <template v-else-if="currentToolDetail">
      <div class="tool-header">
        <div class="tool-icon">
          <el-icon :size="48"><Box /></el-icon>
        </div>
        <div class="tool-title">
          <h1>{{ currentToolDetail.toolName }}</h1>
          <div class="tool-meta">
            <el-tag>版本: {{ currentToolDetail.version }}</el-tag>
            <span class="developer">开发者: {{ currentToolDetail.developer }}</span>
            <span class="published">发布时间: {{ currentToolDetail.published }}</span>
          </div>
        </div>
      </div>

      <el-card class="detail-card">
        <template #header>
          <h2>工具描述</h2>
        </template>
        <p>{{ currentToolDetail.toolDesc }}</p>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <h2>输入文件</h2>
        </template>
        <ul class="file-list">
          <li v-for="(item, index) in currentToolDetail.inFileDesc" :key="index">
            {{ item }}
          </li>
        </ul>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <h2>输出文件</h2>
        </template>
        <ul class="file-list">
          <li v-for="(item, index) in currentToolDetail.outFileDesc" :key="index">
            {{ item }}
          </li>
        </ul>
      </el-card>

      <el-card class="detail-card">
        <template #header>
          <h2>工作流程</h2>
        </template>
        <ul class="workflow-list">
          <li v-for="(step, index) in currentToolDetail.workflowDesc" :key="index">
            {{ step }}
          </li>
        </ul>
      </el-card>
    </template>
  </div>
</template>

<style scoped>
.tool-detail-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #909399;
}

.loading .el-icon {
  margin-bottom: 8px;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tool-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.tool-title h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0 0 12px;
}

.tool-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #64748b;
  font-size: 14px;
}

.developer,
.published {
  color: #64748b;
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

.detail-card p {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.file-list,
.workflow-list {
  margin: 0;
  padding-left: 20px;
}

.file-list li,
.workflow-list li {
  color: #475569;
  line-height: 1.8;
  margin-bottom: 8px;
}

.file-list li:last-child,
.workflow-list li:last-child {
  margin-bottom: 0;
}
</style>
