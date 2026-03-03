FROM node:22-slim

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        curl \
        git \
        vim \
        procps \
        openssh-server \              
    && apt-get clean && \
       rm -rf /var/lib/apt/lists/*

RUN npm install -g opencode-ai

