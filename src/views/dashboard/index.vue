<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ServerResources from '@/components/dashboard/ServerResources.vue'
import TaskOverview from '@/components/dashboard/TaskOverview.vue'

const router = useRouter()
const userStore = useUserStore()

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-left">
        <h1 class="logo">工具平台分析系统</h1>
      </div>
      <div class="header-right">
        <span class="username">{{ userStore.user?.username || '用户' }}</span>
        <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
      </div>
    </header>

    <main class="main">
      <div class="content-grid">
        <div class="left-panel">
          <ServerResources />
        </div>
        <div class="right-panel">
          <TaskOverview />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.username {
  font-size: 14px;
  color: #606266;
}

.main {
  padding: 24px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.left-panel,
.right-panel {
  min-height: 400px;
}
</style>
