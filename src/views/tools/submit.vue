<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToolStore } from '@/stores/tool'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Loading, Box, Plus, Delete, Download, Upload } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ToolParameter } from '@/types/tool.d'
import * as XLSX from 'xlsx'
import ArrayInput from '@/components/common/ArrayInput.vue'
import PathSelector from '@/components/common/PathSelector.vue'

const route = useRoute()
const router = useRouter()
const toolStore = useToolStore()
const { toolParameters, submitting } = storeToRefs(toolStore)

const toolId = computed(() => Number(route.params.id))
const version = computed(() => route.query.version as string)

// 辅助函数：转换参数 key（把 . 替换为 __）避免 Element Plus 路径解析问题
function toSafeKey(key: string): string {
  return key.replace(/\./g, '__')
}

function fromSafeKey(safeKey: string): string {
  return safeKey.replace(/__/g, '.')
}

// 解析参数类型，返回基础类型和是否为数组
function getParamType(param: ToolParameter): { base: string; isArray: boolean } {
  const typeStr = param.type || 'String'
  const match = typeStr.match(/^Array\[(.+)\]$/)
  if (match && match[1]) {
    return { base: match[1], isArray: true }
  }
  return { base: typeStr, isArray: false }
}

// 安全的参数列表，用于模板渲染
const safeParameters = computed(() =>
  toolParameters.value.map((param) => ({
    ...param,
    safeKey: toSafeKey(param.key),
  }))
)

// 支持多任务投递 - 使用扁平化结构
interface TaskItem {
  taskName: string
  projectName: string
  isSequence: boolean
  // 使用扁平化的参数，key 中的 . 被替换为 __
  params: Record<string, string | number | boolean | Array<string | number | boolean>>
}

const taskList = ref<TaskItem[]>([])
const formRefs = ref<FormInstance[]>([])

function createEmptyTask(): TaskItem {
  const initialParams: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  > = {}
  // 为每个参数设置默认值，使用安全的 key
  toolParameters.value.forEach((param: ToolParameter) => {
    const safeKey = toSafeKey(param.key)
    if (param.default !== undefined) {
      initialParams[safeKey] = param.default
    } else {
      const { base, isArray } = getParamType(param)
      if (isArray) {
        initialParams[safeKey] = []
      } else {
        switch (base) {
          case 'Boolean':
            initialParams[safeKey] = false
            break
          case 'Int':
          case 'Float':
            initialParams[safeKey] = 0
            break
          default:
            initialParams[safeKey] = ''
        }
      }
    }
  })
  return {
    taskName: '',
    projectName: '',
    isSequence: false,
    params: initialParams,
  }
}

const rules = computed<FormRules>(() => {
  const formRules: FormRules = {}
  // 任务名校验
  formRules['taskName'] = [{ required: true, message: '请输入任务名称', trigger: 'blur' }]
  // 项目名校验
  formRules['projectName'] = [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
  // 参数校验 - 使用安全的 key
  toolParameters.value.forEach((param: ToolParameter) => {
    if (param.required) {
      const safeKey = toSafeKey(param.key)
      const { isArray, base } = getParamType(param)
      let trigger = 'blur'
      if (isArray || base === 'Boolean') {
        trigger = 'change'
      }
      formRules[`params.${safeKey}`] = [
        {
          required: true,
          message: `请输入${param.name}`,
          trigger,
        },
      ]
    }
  })
  return formRules
})

onMounted(async () => {
  if (!toolId.value || !version.value) {
    ElMessage.error('参数错误')
    router.push('/tools')
    return
  }

  await toolStore.fetchToolParameters(toolId.value, version.value)
  // 重新初始化所有任务的参数默认值
  taskList.value = [createEmptyTask()]
})

async function handleSubmit() {
  // 验证所有表单
  const validatePromises = taskList.value.map((_, index) => {
    return formRefs.value[index]?.validate().catch(() => Promise.reject())
  })

  try {
    await Promise.all(validatePromises)
  } catch {
    ElMessage.error('请完善所有必填项')
    return
  }

  // 构建批量投递数据 - 把安全的 key 转换回原始 key
  const tasks = taskList.value.map((task) => {
    const originalParams: Record<string, string | number | boolean> = {}
    Object.entries(task.params).forEach(([safeKey, value]) => {
      // 数组类型转换为 JSON 字符串
      if (Array.isArray(value)) {
        originalParams[fromSafeKey(safeKey)] = JSON.stringify(value)
      } else {
        originalParams[fromSafeKey(safeKey)] = value
      }
    })
    return {
      taskName: task.taskName,
      projectName: task.projectName,
      is_sequence: task.isSequence,
      params: originalParams,
    }
  })

  await toolStore.submitBatchTask(toolId.value, version.value, tasks)

  if (toolStore.submitSuccess) {
    router.push('/tasks')
  }
}

function handleBack() {
  router.push('/tools')
}

function addTask() {
  taskList.value.push(createEmptyTask())
}

function removeTask(index: number) {
  if (taskList.value.length === 1) {
    ElMessage.warning('至少保留一个任务')
    return
  }
  taskList.value.splice(index, 1)
}

function getPlaceholder(param: ToolParameter): string {
  const { base } = getParamType(param)
  switch (base) {
    case 'File':
      return `请输入${param.name}文件路径`
    case 'Directory':
      return `请输入${param.name}目录路径`
    default:
      return `请输入${param.name}`
  }
}

// 下载参数模板
function downloadTemplate() {
  if (toolParameters.value.length === 0) {
    ElMessage.warning('暂无工具参数')
    return
  }

  // 构建表头
  const headers = ['任务名称', '项目名称', '是否序列执行']
  toolParameters.value.forEach((param) => {
    headers.push(param.name)
  })

  // 构建模板数据（添加一行示例数据）
  const templateData = [
    ['示例任务', '示例项目', 'false'],
    ...toolParameters.value.map((param) => {
      if (param.default !== undefined) {
        return String(param.default)
      }
      const { base, isArray } = getParamType(param)
      if (isArray) {
        return '[]'
      }
      switch (base) {
        case 'Boolean':
          return 'false'
        case 'Int':
        case 'Float':
          return '0'
        default:
          return ''
      }
    }),
  ]

  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet([headers, templateData])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '任务参数模板')

  // 下载文件
  XLSX.writeFile(wb, '任务参数模板.xlsx')
  ElMessage.success('模板下载成功')
}

// 模板填充 - 选择 Excel 文件
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileSelect() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      if (!sheetName) {
        ElMessage.warning('模板文件没有工作表')
        return
      }
      const worksheet = workbook.Sheets[sheetName]
      if (!worksheet) {
        ElMessage.warning('模板文件工作表无效')
        return
      }
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

      if (jsonData.length < 2) {
        ElMessage.warning('模板文件为空或格式不正确')
        return
      }

      // 解析表头
      const headerRow = jsonData[0]
      if (!headerRow) {
        ElMessage.warning('模板文件格式不正确')
        return
      }
      const headers = headerRow.map((h) => String(h))
      const taskNameIndex = headers.indexOf('任务名称')
      const projectNameIndex = headers.indexOf('项目名称')
      const isSequenceIndex = headers.indexOf('是否序列执行')

      if (taskNameIndex === -1 || projectNameIndex === -1) {
        ElMessage.error('模板缺少必要列：任务名称、项目名称')
        return
      }

      // 解析参数列索引 - 使用安全的 key
      const paramIndices: Record<string, number> = {}
      toolParameters.value.forEach((param) => {
        const index = headers.indexOf(param.name)
        if (index !== -1) {
          paramIndices[toSafeKey(param.key)] = index
        }
      })

      // 解析数据行
      const newTasks: TaskItem[] = []
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (!row) continue
        if (!row[taskNameIndex] && !row[projectNameIndex]) continue

        const task: TaskItem = createEmptyTask()
        task.taskName = String(row[taskNameIndex] || '')
        task.projectName = String(row[projectNameIndex] || '')

        if (isSequenceIndex !== -1) {
          const seqValue = String(row[isSequenceIndex] ?? '').toLowerCase()
          task.isSequence = seqValue === 'true' || seqValue === '1' || seqValue === '是'
        }

        // 填充参数 - 使用安全的 key
        Object.entries(paramIndices).forEach(([safeKey, index]) => {
          const originalKey = fromSafeKey(safeKey)
          const param = toolParameters.value.find((p) => p.key === originalKey)
          const cellValue = row[index]
          if (param && cellValue !== undefined && cellValue !== '') {
            const { base, isArray } = getParamType(param)
            if (isArray) {
              // 数组类型尝试解析 JSON 或逗号分隔的值
              try {
                const value = String(cellValue)
                if (value.startsWith('[') && value.endsWith(']')) {
                  task.params[safeKey] = JSON.parse(value)
                } else {
                  task.params[safeKey] = value.split(',').map((v) => v.trim())
                }
              } catch {
                task.params[safeKey] = [String(cellValue)]
              }
            } else {
              const value = String(cellValue)
              switch (base) {
                case 'Int':
                case 'Float':
                  task.params[safeKey] = Number(value) || 0
                  break
                case 'Boolean':
                  task.params[safeKey] =
                    value.toLowerCase() === 'true' || value === '1' || value === '是'
                  break
                default:
                  task.params[safeKey] = value
              }
            }
          }
        })

        newTasks.push(task)
      }

      if (newTasks.length === 0) {
        ElMessage.warning('未解析到有效任务数据')
        return
      }

      // 替换或追加任务
      taskList.value = newTasks
      ElMessage.success(`成功导入 ${newTasks.length} 个任务`)
    } catch (error) {
      console.error('解析 Excel 文件失败:', error)
      ElMessage.error('解析 Excel 文件失败，请检查文件格式')
    }
  }

  reader.readAsBinaryString(file)

  // 重置 input 以便再次选择同一文件
  target.value = ''
}
</script>

<template>
  <div class="submit-page">
    <div class="page-header">
      <el-button :icon="ArrowLeft" @click="handleBack">返回工具库</el-button>
    </div>

    <div v-if="!toolId || !version" class="loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <template v-else>
      <div class="tool-header">
        <div class="tool-icon">
          <el-icon :size="48"><Box /></el-icon>
        </div>
        <div class="tool-title">
          <h1>任务投递</h1>
          <div class="tool-meta">
            <el-tag>版本：{{ version }}</el-tag>
            <span class="tool-id">工具 ID: {{ toolId }}</span>
          </div>
        </div>
        <div class="tool-actions">
          <el-button :icon="Download" @click="downloadTemplate">下载参数模板</el-button>
          <el-button :icon="Upload" @click="triggerFileSelect">模板填充</el-button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".xlsx,.xls"
            style="display: none"
            @change="handleFileSelect"
          />
        </div>
      </div>

      <div class="task-list-header">
        <h2>任务列表</h2>
      </div>

      <div v-for="(task, taskIndex) in taskList" :key="taskIndex" class="task-card-wrapper">
        <el-card class="task-card" shadow="hover" :body-style="{ padding: '24px' }">
          <template #header>
            <div class="task-card-header">
              <span class="task-index">任务 {{ taskIndex + 1 }}</span>
              <el-button
                v-if="taskList.length > 1"
                type="danger"
                :icon="Delete"
                link
                @click="removeTask(taskIndex)"
              >
                删除
              </el-button>
            </div>
          </template>

          <!-- 任务基本信息 -->
          <el-form
            :ref="(el: unknown) => (formRefs[taskIndex] = el as FormInstance)"
            :model="task"
            :rules="rules"
            label-position="top"
            class="task-form"
          >
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="任务名称" prop="taskName">
                  <el-input v-model="task.taskName" placeholder="请输入任务名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目名称" prop="projectName">
                  <el-input v-model="task.projectName" placeholder="请输入项目名称" clearable />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="是否序列执行">
              <el-switch v-model="task.isSequence" active-text="是" inactive-text="否" />
            </el-form-item>

            <el-divider />

            <!-- 工具参数表单 -->
            <el-form-item
              v-for="param in safeParameters"
              :key="param.key"
              :label="param.name"
              :prop="`params.${param.safeKey}`"
            >
              <template #label>
                <span class="label-text">
                  {{ param.name }}
                  <span v-if="param.required" class="required-mark">*</span>
                </span>
                <span v-if="param.desc" class="label-desc">{{ param.desc }}</span>
              </template>

              <!-- 解析类型 -->
              <template v-if="getParamType(param).isArray">
                <!-- Array 类型 -->
                <ArrayInput
                  v-model="task.params[param.safeKey] as Array<string | number | boolean>"
                  :item-type="param.type || 'String'"
                  :placeholder="getPlaceholder(param)"
                />
              </template>
              <!-- Boolean -->
              <el-switch
                v-else-if="getParamType(param).base === 'Boolean'"
                v-model="task.params[param.safeKey] as boolean"
              />

              <!-- Int -->
              <el-input-number
                v-else-if="getParamType(param).base === 'Int'"
                v-model="task.params[param.safeKey] as number"
                :placeholder="getPlaceholder(param)"
                style="width: 200px"
                controls-position="right"
                :precision="0"
                :step="1"
              />

              <!-- Float -->
              <el-input-number
                v-else-if="getParamType(param).base === 'Float'"
                v-model="task.params[param.safeKey] as number"
                :placeholder="getPlaceholder(param)"
                style="width: 200px"
                controls-position="right"
                :precision="2"
                :step="0.01"
              />

              <!-- File -->
              <PathSelector
                v-else-if="getParamType(param).base === 'File'"
                v-model="task.params[param.safeKey] as string"
                type="file"
                :placeholder="getPlaceholder(param)"
              />

              <!-- Directory -->
              <PathSelector
                v-else-if="getParamType(param).base === 'Directory'"
                v-model="task.params[param.safeKey] as string"
                type="directory"
                :placeholder="getPlaceholder(param)"
              />

              <!-- String -->
              <el-input
                v-else
                v-model="task.params[param.safeKey] as string"
                :placeholder="getPlaceholder(param)"
                clearable
              />
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <div class="form-actions">
        <el-button type="primary" :icon="Plus" @click="addTask">添加任务</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          批量提交 (共{{ taskList.length }}个任务)
        </el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.submit-page {
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

.tool-id {
  color: #64748b;
}

.tool-actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.task-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.task-list-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1f36;
  margin: 0;
}

.task-card-wrapper {
  margin-bottom: 24px;
}

.task-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-index {
  font-size: 16px;
  font-weight: 600;
  color: #1a1f36;
}

.task-form {
  margin-top: 0;
}

.el-form-item {
  margin-bottom: 24px;
}

.label-text {
  font-size: 14px;
  font-weight: 500;
  color: #1a1f36;
}

.required-mark {
  color: #f56c6c;
  margin-left: 4px;
}

.label-desc {
  display: block;
  font-size: 12px;
  color: #64748b;
  font-weight: normal;
  margin-top: 4px;
}

.file-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.file-path-input {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .submit-page {
    padding: 0 16px;
  }

  .tool-header {
    flex-direction: column;
    text-align: center;
  }

  .tool-meta {
    flex-direction: column;
    gap: 8px;
  }

  .task-list-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
