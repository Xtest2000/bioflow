<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import PathSelector from './PathSelector.vue'

interface Props {
  modelValue: Array<string | number | boolean>
  itemType: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入',
})

const emit = defineEmits<{
  'update:modelValue': [value: Array<string | number | boolean>]
}>()

const items = ref<Array<string | number | boolean>>([...props.modelValue])

watch(
  () => props.modelValue,
  (newVal) => {
    items.value = [...newVal]
  },
  { deep: true }
)

watch(
  items,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

function addItem() {
  let defaultValue: string | number | boolean = ''
  switch (props.itemType) {
    case 'Int':
    case 'Float':
      defaultValue = 0
      break
    case 'Boolean':
      defaultValue = false
      break
    default:
      defaultValue = ''
  }
  items.value.push(defaultValue)
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}
</script>

<template>
  <div class="array-input">
    <div v-for="(item, index) in items" :key="index" class="array-item">
      <div class="array-item-content">
        <!-- Boolean -->
        <el-switch v-if="itemType === 'Array[Boolean]'" v-model="items[index] as boolean" />

        <!-- Int -->
        <el-input-number
          v-else-if="itemType === 'Array[Int]'"
          v-model="items[index] as number"
          :placeholder="placeholder"
          controls-position="right"
          style="width: 100%"
          :precision="0"
          :step="1"
        />

        <!-- Float -->
        <el-input-number
          v-else-if="itemType === 'Array[Float]'"
          v-model="items[index] as number"
          :placeholder="placeholder"
          controls-position="right"
          style="width: 100%"
          :precision="2"
          :step="0.01"
        />

        <!-- String, File, Directory -->
        <template v-else>
          <!-- File -->
          <PathSelector
            v-if="itemType === 'File'"
            v-model="items[index] as string"
            type="file"
            :placeholder="placeholder"
          />

          <!-- Directory -->
          <PathSelector
            v-else-if="itemType === 'Directory'"
            v-model="items[index] as string"
            type="directory"
            :placeholder="placeholder"
          />

          <!-- String -->
          <el-input v-else v-model="items[index] as string" :placeholder="placeholder" clearable />
        </template>
      </div>
      <el-button type="danger" :icon="Delete" circle @click="removeItem(index)" />
    </div>
    <el-button type="primary" :icon="Plus" @click="addItem">添加一项</el-button>
  </div>
</template>

<style scoped>
.array-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.array-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.array-item-content {
  flex: 1;
}
</style>
