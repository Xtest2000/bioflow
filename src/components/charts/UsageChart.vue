<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

const props = defineProps<{
  usage: number
  label: string
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
      formatter: `{a}: {c}%`,
    },
    series: [
      {
        name: props.label,
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
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
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '-10%'],
          fontSize: 24,
          fontWeight: 'bolder',
          formatter: '{value}%',
          color: getUsageColor(props.usage),
        },
        data: [{ value: Math.round(props.usage) }],
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

watch(() => props.usage, updateChart)

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
  <div class="usage-chart">
    <div ref="chartRef" class="chart-container"></div>
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.usage-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.chart-container {
  width: 150px;
  height: 150px;
}

.label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-top: 8px;
}
</style>
