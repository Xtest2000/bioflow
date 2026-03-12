FROM node:22-slim

# 安装基础工具
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        curl \
        git \
        vim \
        procps \
        openssh-server \
        tmux \
        wget \
        ca-certificates \
        fonts-liberation \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 安装全局工具
RUN npm install -g opencode-ai
RUN npm install -g oh-my-opencode@latest
RUN oh-my-opencode install --no-tui --opencode-zen=yes --claude=no --gemini=no --copilot=no

# 安装 Playwright 测试框架和 Chromium 浏览器（含系统依赖）
# 官方文档：https://playwright.dev/docs/browsers#linux
# --with-deps 会自动安装所有必要的系统依赖
RUN npx playwright install --with-deps chromium
