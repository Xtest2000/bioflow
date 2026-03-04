<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: '',
  password: '',
  remember: false,
})

const loading = ref(false)
const formRef = ref()
const isPageLoaded = ref(false)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      await userStore.login(loginForm.value)
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } catch {
      ElMessage.error('用户名或密码错误')
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    isPageLoaded.value = true
  }, 100)
})
</script>

<template>
  <div class="login-wrapper">
    <!-- Background -->
    <div class="bg-layer">
      <img src="/loginbackground.jpg" alt="background" class="bg-image" />
      <div class="bg-overlay"></div>
    </div>

    <!-- Floating particles -->
    <div class="particles">
      <div v-for="i in 20" :key="i" class="particle" :style="{ '--delay': i * 0.3 + 's' }"></div>
    </div>

    <!-- Decorative elements -->
    <div class="decoration decoration-1"></div>
    <div class="decoration decoration-2"></div>
    <div class="decoration decoration-3"></div>

    <!-- Login card -->
    <div class="login-card" :class="{ 'card-enter': isPageLoaded }">
      <div class="card-header">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="url(#gradient1)" stroke-width="2" />
            <path
              d="M12 20L18 26L28 14"
              stroke="url(#gradient2)"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stop-color="#667eea" />
                <stop offset="100%" stop-color="#764ba2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="12" y1="14" x2="28" y2="26">
                <stop offset="0%" stop-color="#667eea" />
                <stop offset="100%" stop-color="#764ba2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="title">BioFlow</h1>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <div class="input-wrapper">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              size="large"
            />
            <div class="input-glow"></div>
          </div>
        </el-form-item>

        <el-form-item prop="password">
          <div class="input-wrapper">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              size="large"
              show-password
            />
            <div class="input-glow"></div>
          </div>
        </el-form-item>

        <div class="form-options">
          <el-checkbox v-model="loginForm.remember" class="remember-checkbox"> 记住我 </el-checkbox>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <el-form-item>
          <button
            type="button"
            class="login-btn"
            :class="{ 'btn-loading': loading }"
            :disabled="loading"
            @click="handleLogin"
          >
            <span class="btn-text">{{ loading ? '登录中...' : '登 录' }}</span>
            <span class="btn-shimmer"></span>
          </button>
        </el-form-item>
      </el-form>

      <div class="card-footer">
        <p class="test-hint">测试账号: admin / 123456</p>
      </div>
    </div>

    <!-- Bottom decoration -->
    <div class="bottom-wave">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,60 1440,60 L1440,120 L0,120 Z"
          fill="rgba(255,255,255,0.03)"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.login-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family:
    'Outfit',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

/* Background */
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.85) 0%,
    rgba(30, 41, 59, 0.75) 50%,
    rgba(15, 23, 42, 0.9) 100%
  );
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0;
  animation: float-particle 8s infinite;
  animation-delay: var(--delay);
}

.particle:nth-child(odd) {
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.particle:nth-child(3n) {
  width: 3px;
  height: 3px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.particle:nth-child(1) {
  left: 10%;
  top: 20%;
}
.particle:nth-child(2) {
  left: 20%;
  top: 80%;
}
.particle:nth-child(3) {
  left: 30%;
  top: 40%;
}
.particle:nth-child(4) {
  left: 40%;
  top: 70%;
}
.particle:nth-child(5) {
  left: 50%;
  top: 30%;
}
.particle:nth-child(6) {
  left: 60%;
  top: 90%;
}
.particle:nth-child(7) {
  left: 70%;
  top: 50%;
}
.particle:nth-child(8) {
  left: 80%;
  top: 20%;
}
.particle:nth-child(9) {
  left: 90%;
  top: 60%;
}
.particle:nth-child(10) {
  left: 5%;
  top: 50%;
}
.particle:nth-child(11) {
  left: 15%;
  top: 35%;
}
.particle:nth-child(12) {
  left: 25%;
  top: 65%;
}
.particle:nth-child(13) {
  left: 35%;
  top: 85%;
}
.particle:nth-child(14) {
  left: 45%;
  top: 15%;
}
.particle:nth-child(15) {
  left: 55%;
  top: 55%;
}
.particle:nth-child(16) {
  left: 65%;
  top: 25%;
}
.particle:nth-child(17) {
  left: 75%;
  top: 75%;
}
.particle:nth-child(18) {
  left: 85%;
  top: 45%;
}
.particle:nth-child(19) {
  left: 95%;
  top: 35%;
}
.particle:nth-child(20) {
  left: 50%;
  top: 5%;
}

@keyframes float-particle {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  10% {
    opacity: 0.8;
    transform: translateY(-20px) scale(1);
  }
  90% {
    opacity: 0.8;
    transform: translateY(-100px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-120px) scale(0);
  }
}

/* Decorations */
.decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 1;
  animation: pulse-glow 4s ease-in-out infinite;
}

.decoration-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.decoration-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  bottom: -50px;
  right: -50px;
  animation-delay: 1.5s;
}

.decoration-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  top: 50%;
  right: 10%;
  animation-delay: 3s;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

/* Login card */
.login-card {
  position: relative;
  z-index: 10;
  width: 420px;
  padding: 48px 40px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-enter {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Card header */
.card-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  animation: logo-float 3s ease-in-out infinite;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

@keyframes logo-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 0.5px;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Form */
.login-form {
  margin-top: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-form-item__error) {
  color: #f87171;
  padding-top: 4px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper :deep(.el-input) {
  width: 100%;
}

.input-wrapper :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: none;
  padding: 12px 16px;
  transition: all 0.3s ease;
  min-height: 48px;
}

.input-wrapper :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.input-wrapper :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(102, 126, 234, 0.6);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.input-wrapper :deep(.el-input__inner) {
  color: #fff;
  font-size: 15px;
  font-weight: 400;
}

.input-wrapper :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.4);
}

.input-wrapper :deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.5);
}

.input-wrapper :deep(.el-input__suffix) {
  color: rgba(255, 255, 255, 0.5);
}

/* Form options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-checkbox :deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.remember-checkbox :deep(.el-checkbox__inner) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.remember-checkbox :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
}

.forgot-link {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #667eea;
}

/* Login button */
.login-btn {
  position: relative;
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

.btn-loading .btn-shimmer {
  animation: shimmer 1s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Card footer */
.card-footer {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.test-hint {
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* Bottom wave */
.bottom-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 2;
  pointer-events: none;
}

.bottom-wave svg {
  width: 100%;
  height: 100%;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    width: calc(100% - 32px);
    padding: 32px 24px;
    margin: 16px;
  }

  .title {
    font-size: 22px;
  }

  .logo-icon {
    width: 56px;
    height: 56px;
  }
}
</style>
