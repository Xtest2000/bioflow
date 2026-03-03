# 项目规划文档

## 项目概述

**项目名称**：工具平台类分析系统

**项目类型**：前后端分离的 Web 应用

**核心定位**：提供多种工具给用户使用的数据分析平台

---

## 技术栈

| 层级        | 技术选型                    |
| ----------- | --------------------------- |
| 前端框架    | Vue 3 + TypeScript + Vite   |
| UI 组件库   | Element Plus                |
| 状态管理    | Pinia                       |
| 路由        | Vue Router                  |
| HTTP 客户端 | Axios                       |
| 后端框架    | Python Django               |
| API 层      | Django REST Framework (DRF) |
| 认证方式    | JWT Token                   |
| 代码仓库    | 前后端独立仓库              |

---

## 核心功能模块

### 1. 用户认证与权限

- 用户登录/注册
- JWT Token 认证
- 权限控制（路由守卫）
- 用户信息管理

### 2. 数据报表管理

- 报表列表（搜索、筛选、分页）
- 报表详情查看
- 数据导出功能

### 3. 工具平台（扩展）

- 工具分类导航
- 工具使用页面
- 用户工作台

---

## 开发阶段

### 阶段 1：项目基础搭建

- [x] 项目初始化（Vue 3 + TypeScript）
- [ ] 安装 Element Plus 及相关依赖
- [ ] 配置 Axios 请求封装
- [ ] 创建基础布局（侧边栏 + 顶栏 + 内容区）
- [ ] 配置路由及路由守卫
- [ ] 用户状态管理（Pinia Store）

### 阶段 2：用户认证模块

- [ ] 登录页面
- [ ] 注册页面
- [ ] JWT Token 处理
- [ ] 权限控制实现

### 阶段 3：数据报表管理

- [ ] 报表列表页
- [ ] 报表详情页
- [ ] 数据表格组件
- [ ] 导出功能

### 阶段 4：工具平台扩展

- [ ] 工具分类导航
- [ ] 工具使用页面
- [ ] 用户工作台

---

## 目录结构规划

```
src/
├── api/              # API 请求
│   ├── index.ts      # Axios 实例配置
│   └── auth.ts       # 认证相关 API
├── assets/           # 静态资源
├── components/       # 公共组件
│   └── common/       # 通用组件
├── composables/      # 组合式函数
├── layouts/          # 布局组件
│   └── MainLayout.vue
├── router/           # 路由配置
│   └── index.ts
├── stores/           # Pinia 状态管理
│   └── user.ts
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
│   └── index.ts
├── utils/            # 工具函数
├── views/            # 页面组件
│   ├── login/        # 登录页
│   ├── dashboard/    # 仪表盘
│   └── reports/      # 报表管理
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

---

## API 规划（对接 Django 后端）

### 认证相关

| 接口                  | 方法 | 说明             |
| --------------------- | ---- | ---------------- |
| `/api/auth/login/`    | POST | 用户登录         |
| `/api/auth/logout/`   | POST | 用户登出         |
| `/api/auth/register/` | POST | 用户注册         |
| `/api/auth/refresh/`  | POST | 刷新 Token       |
| `/api/auth/user/`     | GET  | 获取当前用户信息 |

### 报表相关

| 接口                   | 方法 | 说明         |
| ---------------------- | ---- | ------------ |
| `/api/reports/`        | GET  | 获取报表列表 |
| `/api/reports/:id/`    | GET  | 获取报表详情 |
| `/api/reports/export/` | GET  | 导出报表数据 |

---

## 后端仓库信息

> 待补充：Django 后端仓库地址
