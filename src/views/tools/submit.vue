<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToolStore } from '@/stores/tool'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Loading, Box, Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ToolParameter } from '@/types/tool.d'

const route = useRoute()
const router = useRouter()
const toolStore = useToolStore()
const { toolParameters, submitting } = storeToRefs(toolStore)

const toolId = computed(() => Number(route.params.id))
const version = computed(() => route.query.version as string)

// 支持多任务投递
interface TaskItem {
  taskName: string
  projectName: string
  isSequence: boolean
  params: Record<string, string | number | boolean>
}

const taskList = ref<TaskItem[]>([createEmptyTask()])
const formRefs = ref<FormInstance[]>([])

function createEmptyTask(): TaskItem {
  const initialParams: Record<string, string | number | boolean> = {}
  // 为每个参数设置默认值
  toolParameters.value.forEach((param: ToolParameter) => {
    if (param.default !== undefined) {
      initialParams[param.key] = param.default
    } else {
      switch (param.controlType) {
        case 'boolean':
          initialParams[param.key] = false
          break
        case 'number':
          initialParams[param.key] = 0
          break
        default:
          initialParams[param.key] = ''
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
  formRules[`taskName`] = [{ required: true, message: '请输入任务名称', trigger: 'blur' }]
  // 项目名校验
  formRules[`projectName`] = [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
  // 参数校验
  toolParameters.value.forEach((param: ToolParameter) => {
    if (param.required) {
      formRules[`params.${param.key}`] = [
        {
          required: true,
          message: `请输入${param.name}`,
          trigger: param.controlType === 'boolean' ? 'change' : 'blur',
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

  // 构建批量投递数据
  const tasks = taskList.value.map((task) => ({
    taskName: task.taskName,
    projectName: task.projectName,
    is_sequence: task.isSequence ? 'true' : 'false',
    params: task.params,
  }))

  await toolStore.submitBatchTask(toolId.value, version.value, tasks)

  if (toolStore.submitSuccess) {
    ElMessage.success(`成功提交 ${tasks.length} 个任务`)
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
  switch (param.controlType) {
    case 'file':
      return `请输入${param.name}文件路径`
    case 'select':
      return `请选择${param.name}`
    case 'number':
      return `请输入${param.name}`
    default:
      return `请输入${param.name}`
  }
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
            :ref="(el) => (formRefs[taskIndex] = el)"
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
              v-for="param in toolParameters"
              :key="param.key"
              :label="param.name"
              :prop="`params.${param.key}`"
            >
              <template #label>
                <span class="label-text">
                  {{ param.name }}
                  <span v-if="param.required" class="required-mark">*</span>
                </span>
                <span v-if="param.desc" class="label-desc">{{ param.desc }}</span>
              </template>

              <!-- file: 文件路径输入 -->
              <el-input
                v-if="param.controlType === 'file'"
                v-model="task.params[param.key] as string"
                :placeholder="getPlaceholder(param)"
                clearable
              />

              <!-- string: 文本输入 -->
              <el-input
                v-else-if="param.controlType === 'string'"
                v-model="task.params[param.key] as string"
                :placeholder="getPlaceholder(param)"
                clearable
              />

              <!-- select: 下拉选择 -->
              <el-select
                v-else-if="param.controlType === 'select'"
                v-model="task.params[param.key] as string"
                :placeholder="getPlaceholder(param)"
                style="width: 100%"
              >
                <el-option
                  v-for="option in param.options"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>

              <!-- number: 数字输入 -->
              <el-input-number
                v-else-if="param.controlType === 'number'"
                v-model="task.params[param.key] as number"
                :placeholder="getPlaceholder(param)"
                style="width: 100%"
                controls-position="right"
              />

              <!-- boolean: 开关 -->
              <el-switch
                v-else-if="param.controlType === 'boolean'"
                v-model="task.params[param.key] as boolean"
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
