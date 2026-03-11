<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolStore } from '@/stores/tool'
import { storeToRefs } from 'pinia'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const toolStore = useToolStore()
const { tools, pagination, isLoading, addDialogVisible, deleteDialogVisible, addPackagePath } =
  storeToRefs(toolStore)

const searchInput = ref('')
const selectedVersions = ref<Record<number, string>>({})
const localSelectedToolId = ref<number | null>(null)

function handleSearch() {
  toolStore.setSearchName(searchInput.value)
  toolStore.fetchTools(1, pagination.value.pageSize)
}

function handleReset() {
  searchInput.value = ''
  toolStore.setSearchName('')
  toolStore.fetchTools(1, pagination.value.pageSize)
}

function handlePageChange(page: number) {
  toolStore.fetchTools(page, pagination.value.pageSize)
}

function handleSizeChange(size: number) {
  toolStore.fetchTools(1, size)
}

function handleUseTool(tool: { toolID: number }) {
  const version = selectedVersions.value[tool.toolID]
  router.push({
    path: `/tools/${tool.toolID}`,
    query: {
      version: version || tools.value.find((t) => t.toolID === tool.toolID)?.versions[0] || '',
    },
  })
}

function initVersions() {
  tools.value.forEach((tool) => {
    if (tool.versions.length > 0 && !selectedVersions.value[tool.toolID]) {
      selectedVersions.value[tool.toolID] = tool.versions[0]
    }
  })
}

onMounted(() => {
  toolStore.fetchTools().then(() => {
    initVersions()
  })
})

function handleAddTool() {
  toolStore.openAddDialog()
}

function handleAddToolConfirm() {
  toolStore.handleAddTool()
}

function handleDeleteToolConfirm() {
  toolStore.handleDeleteTool()
}

function closeAddDialog() {
  toolStore.closeAddDialog()
}

function closeDeleteDialog() {
  toolStore.closeDeleteDialog()
}

function openDeleteDialog(toolId: number) {
  localSelectedToolId.value = toolId
  toolStore.openDeleteDialog(toolId)
}
</script>

<template>
  <div class="tools-page">
    <div class="page-header">
      <h1 class="page-title">工具库</h1>
      <p class="page-subtitle">选择您需要的工具开始工作</p>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchInput"
        placeholder="输入工具名称搜索"
        :prefix-icon="Search"
        clearable
        style="width: 300px"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      <el-button type="primary" :icon="Plus" @click="handleAddTool">添加工具</el-button>
    </div>

    <div v-if="isLoading" class="loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <template v-else>
      <div v-if="tools.length > 0" class="tools-grid">
        <el-card
          v-for="tool in tools"
          :key="tool.toolID"
          class="tool-card"
          shadow="hover"
          :body-style="{ padding: '24px' }"
        >
          <div class="tool-icon">
            <el-icon :size="40"><Box /></el-icon>
          </div>
          <div class="tool-info">
            <h3 class="tool-name">{{ tool.toolName }}</h3>
            <p class="tool-desc">{{ tool.toolDesc }}</p>
            <div class="tool-versions">
              <el-select
                v-model="selectedVersions[tool.toolID]"
                placeholder="选择版本"
                style="width: 100%"
              >
                <el-option
                  v-for="version in tool.versions"
                  :key="version"
                  :label="version"
                  :value="version"
                />
              </el-select>
            </div>
          </div>
          <div class="tool-actions">
            <el-button type="danger" link size="small" @click="openDeleteDialog(tool.toolID)">
              <el-icon :size="16"><Delete /></el-icon>
            </el-button>
            <el-button type="primary" @click="handleUseTool(tool)">立即使用</el-button>
          </div>
        </el-card>
      </div>

      <el-empty v-else description="暂无工具数据" />

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </template>

    <!-- 添加工具弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加工具"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="addPackagePath" label-width="100px">
        <el-form-item label="工具包路径">
          <el-input v-model="addPackagePath" placeholder="/path/to/tool/package" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeAddDialog">取消</el-button>
        <el-button type="primary" @click="handleAddToolConfirm" :loading="isLoading"
          >确定</el-button
        >
      </template>
    </el-dialog>

    <!-- 删除工具确认弹窗 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-alert
        type="warning"
        title="确定要删除此工具吗？"
        description="此操作不可恢复，请谨慎操作"
      />
      <template #footer>
        <el-button @click="closeDeleteDialog">取消</el-button>
        <el-button type="danger" @click="handleDeleteToolConfirm" :loading="isLoading"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Box, Loading } from '@element-plus/icons-vue'
export default {
  components: { Box, Loading },
}
</script>

<style scoped>
.tools-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
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

.search-bar {
  display: flex;
  gap: 12px;
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

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
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

.tool-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0 0 8px;
}

.tool-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 12px;
}

.tool-versions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-actions {
  display: flex;
  justify-content: flex-end;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}
</style>
