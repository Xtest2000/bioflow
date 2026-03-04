<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const props = defineProps<{
  usage: number
  cores: number
}>()

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
      formatter: `{a} <br/>{b}: {c}%`,
    },
    series: [
      {
        name: 'CPU',
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: getUsageColor(props.usage),
        },
        progress: {
          show: true,
          width: 20,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 20,
            color: [[1, '#e5e5e5']],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-10%'],
          fontSize: 24,
          fontWeight: 'bolder',
          formatter: '{value}%',
          color: getUsageColor(props.usage),
        },
        data: [
          {
            value: props.usage,
          },
        ],
      },
    ],
  }

  chart.setOption(option)
}

function getUsageColor(usage: number): string {
  if (usage >= 80) return '#f56c6c'
  if (usage >= 60) return '#e6a23c'
  return '#67c23a'
}

function handleResize() {
  chart?.resize()
}

watch(
  () => props.usage,
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
  <div class="cpu-chart">
    <div ref="chartRef" class="chart-container"></div>
    <div class="chart-info">
      <span class="label">CPU 使用率</span>
      <span class="cores">{{ cores }} 核心</span>
    </div>
  </div>
</template>

<style scoped>
.cpu-chart {
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

.cores {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
