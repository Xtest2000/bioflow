<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { HomeFilled, Grid, List, User, SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => {
  const path = route.path
  if (path.includes('/dashboard') || path === '/') return '/dashboard'
  if (path.includes('/tools')) return '/tools'
  if (path.includes('/tasks')) return '/tasks'
  return '/dashboard'
})

function handleMenuSelect(key: string) {
  router.push(key)
}

async function handleLogout() {
  await userStore.logout()
  router.replace('/login')
}

function goToProfile() {
  router.push('/profile')
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <span class="brand-text">BioFlow</span>
    </div>

    <nav class="navbar-menu">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        :ellipsis="false"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/dashboard" class="menu-item">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/tools" class="menu-item">
          <el-icon><Grid /></el-icon>
          <span>工具库</span>
        </el-menu-item>
        <el-menu-item index="/tasks" class="menu-item">
          <el-icon><List /></el-icon>
          <span>任务列表</span>
        </el-menu-item>
      </el-menu>
    </nav>

    <div class="navbar-user">
      <el-dropdown
        trigger="click"
        @command="(cmd: string) => (cmd === 'logout' ? handleLogout() : goToProfile())"
      >
        <div class="user-trigger">
          <el-avatar :size="32" class="user-avatar">
            {{ userStore.user?.username?.charAt(0).toUpperCase() || 'U' }}
          </el-avatar>
          <span class="user-name">{{ userStore.user?.username || '用户' }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>
              <span>个人设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script lang="ts">
import { ArrowDown } from '@element-plus/icons-vue'
export default {
  components: { ArrowDown },
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  background: linear-gradient(135deg, #1a1f36 0%, #2d3561 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.brand-icon {
  width: 32px;
  height: 32px;
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.navbar-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar-menu :deep(.el-menu) {
  background: transparent;
  border: none;
  height: 60px;
}

.navbar-menu :deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  color: rgba(248, 250, 252, 0.7);
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.navbar-menu :deep(.el-menu-item:hover) {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.08);
}

.navbar-menu :deep(.el-menu-item.is-active) {
  color: #60a5fa;
  border-bottom-color: #60a5fa;
  background: rgba(96, 165, 250, 0.1);
}

.navbar-menu :deep(.el-menu-item .el-icon) {
  margin-right: 6px;
}

.navbar-user {
  flex-shrink: 0;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #fff;
  font-weight: 600;
}

.user-name {
  color: #f8fafc;
  font-weight: 500;
  font-size: 14px;
}

.dropdown-icon {
  color: rgba(248, 250, 252, 0.7);
  transition: transform 0.3s ease;
}

.user-trigger:hover .dropdown-icon {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 12px;
  }

  .brand-text {
    display: none;
  }

  .user-name {
    display: none;
  }

  .navbar-menu :deep(.el-menu-item span) {
    display: none;
  }
}
</style>
