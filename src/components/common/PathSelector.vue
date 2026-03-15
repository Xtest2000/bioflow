<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Folder, Document, Search, Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fetchPathStructure } from '@/api/fileSystem'
import type { FileSystemEntry } from '@/types/fileSystem'

interface Props {
  modelValue: string
  type: 'file' | 'directory'
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择路径',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const dialogVisible = ref(false)
const currentPath = ref('/')
const selectedPath = ref('')
const searchQuery = ref('')
const searchMode = ref(false)
const loading = ref(false)

// 当前目录的文件系统条目
const currentEntries = ref<FileSystemEntry[]>([])

// 已访问路径缓存（用于搜索）
const visitedPaths = ref<Record<string, FileSystemEntry[]>>({})

// 过滤显示的项目（File 类型显示所有，Directory 类型只显示目录）
const filteredItems = computed(() => {
  if (props.type === 'directory') {
    return currentEntries.value.filter((item) => item.type === 'directory')
  }
  return currentEntries.value
})

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  const results: FileSystemEntry[] = []

  Object.values(visitedPaths.value).forEach((entries) => {
    entries.forEach((entry) => {
      if (props.type === 'directory' && entry.type !== 'directory') return
      if (entry.name.toLowerCase().includes(query) || entry.path.toLowerCase().includes(query)) {
        results.push(entry)
      }
    })
  })

  return results
})

// 加载目录内容
async function loadDirectory(path: string) {
  loading.value = true
  try {
    const response = await fetchPathStructure({ path })
    currentEntries.value = response.entries
    currentPath.value = path
    // 缓存已访问路径
    visitedPaths.value[path] = response.entries
  } catch (error) {
    console.error('加载目录失败:', error)
    ElMessage.error('加载目录失败')
    currentEntries.value = []
  } finally {
    loading.value = false
  }
}

// 格式化文件大小
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function openDialog() {
  dialogVisible.value = true
  selectedPath.value = props.modelValue || ''
  searchQuery.value = ''
  searchMode.value = false
  visitedPaths.value = {}
  loadDirectory('/')
}

function navigateTo(item: FileSystemEntry) {
  if (item.type === 'directory') {
    loadDirectory(item.path)
  } else if (props.type === 'file') {
    selectedPath.value = item.path
  }
}

// 从搜索结果中选择
function selectSearchResult(item: FileSystemEntry) {
  selectedPath.value = item.path
  if (item.type === 'directory') {
    currentPath.value = item.path
    // 如果缓存中没有该目录，加载它
    if (!visitedPaths.value[item.path]) {
      loadDirectory(item.path)
    }
  }
  searchQuery.value = ''
  searchMode.value = false
}

function goUp() {
  if (currentPath.value === '/') return
  const parts = currentPath.value.split('/')
  parts.pop()
  const parentPath = parts.length === 1 ? '/' : parts.join('/')
  loadDirectory(parentPath)
}

function selectCurrent() {
  selectedPath.value = currentPath.value
}

function confirm() {
  if (selectedPath.value) {
    emit('update:modelValue', selectedPath.value)
  }
  dialogVisible.value = false
}

function cancel() {
  dialogVisible.value = false
}

// 输入路径直接跳转
function goToPath() {
  const path = searchQuery.value.trim()
  if (!path) return

  // 尝试加载该路径
  if (path.startsWith('/')) {
    loadDirectory(path)
    searchQuery.value = ''
    searchMode.value = false
  } else {
    // 相对路径或搜索词
    searchMode.value = true
  }
}

// 重置状态
watch(dialogVisible, (val) => {
  if (!val) {
    // 关闭对话框时清空缓存
    visitedPaths.value = {}
  }
})

// 监听搜索输入
watch(searchQuery, (val) => {
  if (val.trim()) {
    searchMode.value = true
  } else {
    searchMode.value = false
  }
})
</script>

<template>
  <div class="path-selector">
    <el-input :model-value="modelValue" :placeholder="placeholder" readonly @click="openDialog">
      <template #append>
        <el-button @click="openDialog">
          {{ type === 'file' ? '浏览' : '选择目录' }}
        </el-button>
      </template>
    </el-input>

    <el-dialog
      v-model="dialogVisible"
      :title="type === 'file' ? '选择文件' : '选择目录'"
      width="600px"
      destroy-on-close
    >
      <div class="path-browser">
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="输入路径或搜索文件名..."
            clearable
            @keyup.enter="goToPath"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button @click="goToPath">跳转</el-button>
            </template>
          </el-input>
        </div>

        <!-- Loading 状态 -->
        <div v-if="loading" class="loading-container">
          <el-icon class="is-loading" :size="32"><Loading /></el-icon>
          <span class="loading-text">加载中...</span>
        </div>

        <!-- 搜索结果 -->
        <div v-else-if="searchMode && searchResults.length > 0" class="search-results">
          <div class="search-header">搜索结果 ({{ searchResults.length }})</div>
          <div class="file-list">
            <div
              v-for="item in searchResults"
              :key="item.path"
              class="file-item"
              :class="{ selected: selectedPath === item.path }"
              @click="selectSearchResult(item)"
            >
              <el-icon v-if="item.type === 'directory'" :size="20">
                <Folder />
              </el-icon>
              <el-icon v-else :size="20">
                <Document />
              </el-icon>
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-path">{{ item.path }}</span>
              </div>
              <div class="item-meta">
                <span v-if="item.type === 'file'" class="item-size">{{
                  formatSize(item.size)
                }}</span>
                <span class="item-time">{{ item.modified_human }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 无搜索结果 -->
        <div v-else-if="searchMode && searchResults.length === 0" class="no-results">
          <el-empty description="未找到匹配的路径">
            <el-button size="small" @click="searchQuery = ''">清除搜索</el-button>
          </el-empty>
        </div>

        <!-- 正常浏览模式 -->
        <template v-else>
          <div class="current-path">
            <el-button size="small" :disabled="currentPath === '/'" @click="goUp">
              上级目录
            </el-button>
            <span class="path-text">当前：{{ currentPath }}</span>
          </div>

          <div class="file-list">
            <div
              v-for="item in filteredItems"
              :key="item.path"
              class="file-item"
              :class="{ selected: selectedPath === item.path }"
              @click="navigateTo(item)"
              @dblclick="item.type === 'directory' ? null : confirm()"
            >
              <el-icon v-if="item.type === 'directory'" :size="20">
                <Folder />
              </el-icon>
              <el-icon v-else :size="20">
                <Document />
              </el-icon>
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <div class="item-meta">
                  <span v-if="item.type === 'file'" class="item-size">{{
                    formatSize(item.size)
                  }}</span>
                  <span class="item-time">{{ item.modified_human }}</span>
                </div>
              </div>
            </div>

            <div v-if="filteredItems.length === 0" class="empty">空目录</div>
          </div>

          <div v-if="type === 'directory'" class="select-current">
            <el-button type="primary" @click="selectCurrent">
              选择当前目录：{{ currentPath }}
            </el-button>
          </div>
        </template>

        <div v-if="selectedPath" class="selected-info">已选择：{{ selectedPath }}</div>
      </div>

      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :disabled="!selectedPath" @click="confirm"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.path-selector {
  display: inline-flex;
  width: 100%;
}

.path-browser {
  min-height: 300px;
}

.search-box {
  margin-bottom: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: #909399;
}

.loading-text {
  font-size: 14px;
}

.current-path {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 12px;
}

.path-text {
  color: #606266;
  font-size: 14px;
}

.search-results {
  margin-top: 12px;
}

.search-header {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px 4px 0 0;
  font-size: 13px;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-bottom: none;
}

.file-list {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  max-height: 250px;
  overflow-y: auto;
}

.search-results .file-list {
  border-radius: 0 0 4px 4px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item:hover {
  background: #f5f7fa;
}

.file-item.selected {
  background: #ecf5ff;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.item-name {
  font-size: 14px;
  color: #303133;
}

.item-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #909399;
}

.item-size {
  color: #909399;
}

.item-time {
  color: #c0c4cc;
}

.item-path {
  font-size: 12px;
  color: #909399;
}

.empty {
  padding: 40px;
  text-align: center;
  color: #909399;
}

.no-results {
  padding: 20px;
}

.select-current {
  margin-top: 12px;
  text-align: center;
}

.selected-info {
  margin-top: 12px;
  padding: 8px 12px;
  background: #f0f9eb;
  border-radius: 4px;
  color: #67c23a;
  font-size: 14px;
}
</style>
