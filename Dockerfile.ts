FROM node:22-slim

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        curl \
        git \
        vim \
        procps \
        openssh-server \
        tmux \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean && \
       rm -rf /var/lib/apt/lists/*

RUN npm install -g opencode-ai
RUN npm install -g oh-my-opencode@latest
RUN oh-my-opencode install --no-tui --opencode-zen=yes --claude=no --gemini=no --copilot=no

