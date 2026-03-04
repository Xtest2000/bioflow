<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const props = defineProps<{
  used: number
  total: number
}>()

const usage = computed(() => Math.round((props.used / props.total) * 100))

const chartRef = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chart) return

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: unknown) => {
        const p = params as { name: string; value: number; percent: number }
        return `${p.name}: ${p.value}GB (${p.percent}%)`
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: '硬盘',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return `{value|${usage.value}%}\n{label|使用率}`
          },
          rich: {
            value: {
              fontSize: 24,
              fontWeight: 'bold',
              color: getUsageColor(usage.value),
            },
            label: {
              fontSize: 12,
              color: '#909399',
              padding: [4, 0, 0, 0],
            },
          },
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: props.used,
            name: '已使用',
            itemStyle: { color: getUsageColor(usage.value) },
          },
          {
            value: props.total - props.used,
            name: '可用',
            itemStyle: { color: '#e5e5e5' },
          },
        ],
      },
    ],
  }

  chart.setOption(option)
}

function getUsageColor(usagePercent: number): string {
  if (usagePercent >= 80) return '#f56c6c'
  if (usagePercent >= 60) return '#e6a23c'
  return '#67c23a'
}

function handleResize() {
  chart?.resize()
}

watch(
  () => [props.used, props.total],
  () => {
    updateChart()
  }
)

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="disk-chart">
    <div ref="chartRef" class="chart-container"></div>
    <div class="chart-info">
      <span class="label">硬盘</span>
      <span class="detail">{{ used }}GB / {{ total }}GB</span>
    </div>
  </div>
</template>

<style scoped>
.disk-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.chart-container {
  width: 150px;
  height: 150px;
}

.chart-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}

.label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.detail {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
