<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="dashboard">
    <h1>仪表盘</h1>
    <p>欢迎, {{ userStore.user?.username || '用户' }}</p>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}
</style>
