<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Folder, Document, Search } from '@element-plus/icons-vue'

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

// 模拟文件系统结构
const mockFileSystem: Record<string, { name: string; type: 'file' | 'directory' }[]> = {
  '/': [
    { name: 'data', type: 'directory' },
    { name: 'home', type: 'directory' },
    { name: 'tmp', type: 'directory' },
    { name: 'config.yaml', type: 'file' },
  ],
  '/data': [
    { name: 'cromwell_workdir', type: 'directory' },
    { name: 'projects', type: 'directory' },
    { name: 'samples', type: 'directory' },
    { name: 'reference', type: 'directory' },
  ],
  '/data/cromwell_workdir': [
    { name: 'CNV_V10.0.0.0', type: 'directory' },
    { name: 'SNP', type: 'directory' },
    { name: 'RNASeq', type: 'directory' },
  ],
  '/data/projects': [
    { name: 'project_001', type: 'directory' },
    { name: 'project_002', type: 'directory' },
  ],
  '/data/samples': [
    { name: 'sample_001.fastq', type: 'file' },
    { name: 'sample_002.fastq', type: 'file' },
    { name: 'sample_003.bam', type: 'file' },
  ],
  '/data/reference': [
    { name: 'GRCh38.fa', type: 'file' },
    { name: 'hg19.fa', type: 'file' },
    { name: 'dbsnp.vcf', type: 'file' },
  ],
  '/home': [
    { name: 'user', type: 'directory' },
    { name: 'scripts', type: 'directory' },
  ],
  '/home/user': [
    { name: 'analysis.py', type: 'file' },
    { name: 'config.json', type: 'file' },
  ],
  '/home/scripts': [
    { name: 'run_pipeline.sh', type: 'file' },
    { name: 'qc.sh', type: 'file' },
  ],
  '/tmp': [
    { name: 'output', type: 'directory' },
    { name: 'logs', type: 'directory' },
  ],
}

// 所有已知路径（用于搜索）
const allPaths = computed(() => {
  const paths: { path: string; name: string; type: 'file' | 'directory' }[] = []
  Object.entries(mockFileSystem).forEach(([dirPath, items]) => {
    items.forEach((item) => {
      const fullPath = dirPath === '/' ? `/${item.name}` : `${dirPath}/${item.name}`
      paths.push({ path: fullPath, name: item.name, type: item.type })
    })
  })
  return paths
})

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase()
  return allPaths.value.filter((item) => {
    // Directory 类型只显示目录
    if (props.type === 'directory' && item.type !== 'directory') return false
    // 匹配路径或名称
    return item.path.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)
  })
})

const currentItems = computed(() => {
  return mockFileSystem[currentPath.value] || []
})

// 过滤显示的项目（File 类型显示所有，Directory 类型只显示目录）
const filteredItems = computed(() => {
  if (props.type === 'directory') {
    return currentItems.value.filter((item) => item.type === 'directory')
  }
  return currentItems.value
})

function openDialog() {
  dialogVisible.value = true
  selectedPath.value = props.modelValue || ''
  searchQuery.value = ''
  searchMode.value = false
}

function navigateTo(item: { name: string; type: 'file' | 'directory' }) {
  if (item.type === 'directory') {
    currentPath.value =
      currentPath.value === '/' ? `/${item.name}` : `${currentPath.value}/${item.name}`
  } else if (props.type === 'file') {
    // 文件类型：点击文件直接选中
    selectedPath.value =
      currentPath.value === '/' ? `/${item.name}` : `${currentPath.value}/${item.name}`
  }
}

// 从搜索结果中选择
function selectSearchResult(item: { path: string; name: string; type: 'file' | 'directory' }) {
  selectedPath.value = item.path
  // 如果是目录，可以跳转到该目录
  if (item.type === 'directory') {
    currentPath.value = item.path
  }
  searchQuery.value = ''
  searchMode.value = false
}

function goUp() {
  if (currentPath.value === '/') return
  const parts = currentPath.value.split('/')
  parts.pop()
  currentPath.value = parts.length === 1 ? '/' : parts.join('/')
}

function selectCurrent() {
  // Directory 类型：选择当前目录
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

  // 检查是否是有效路径
  if (mockFileSystem[path] || path === '/') {
    currentPath.value = path
    searchQuery.value = ''
    searchMode.value = false
  } else if (path.startsWith('/')) {
    // 尝试提取父目录
    const parts = path.split('/')
    const possibleFile = parts.pop()
    const parentPath = parts.join('/') || '/'

    if (mockFileSystem[parentPath]) {
      // 检查是否是文件
      const items = mockFileSystem[parentPath]
      const fileItem = items.find((i) => i.name === possibleFile)
      if (fileItem && (props.type === 'file' || fileItem.type === 'directory')) {
        selectedPath.value = path
        currentPath.value = parentPath
        searchQuery.value = ''
        searchMode.value = false
        return
      }
    }

    // 路径不存在，作为搜索词使用
    searchMode.value = true
  } else {
    // 相对路径或搜索词
    searchMode.value = true
  }
}

// 重置状态
watch(
  dialogVisible,
  (val) => {
    if (val) {
      currentPath.value = '/'
      selectedPath.value = props.modelValue || ''
      searchQuery.value = ''
      searchMode.value = false
    }
  },
  { immediate: true }
)

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

        <!-- 搜索结果 -->
        <div v-if="searchMode && searchResults.length > 0" class="search-results">
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
              :key="item.name"
              class="file-item"
              :class="{ selected: selectedPath.includes(item.name) }"
              @click="navigateTo(item)"
              @dblclick="item.type === 'directory' ? null : confirm()"
            >
              <el-icon v-if="item.type === 'directory'" :size="20">
                <Folder />
              </el-icon>
              <el-icon v-else :size="20">
                <Document />
              </el-icon>
              <span class="item-name">{{ item.name }}</span>
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
}

.item-name {
  font-size: 14px;
  color: #303133;
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
