# Base stage
FROM node:24.12-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NPM_CONFIG_STORE_DIR=/tmp/pnpm-store
RUN corepack enable
WORKDIR /app

# Deps stage
FROM base AS deps
ARG NPM_REGISTRY_URL=""
RUN if [ -n "$NPM_REGISTRY_URL" ]; then \
        npm config set registry $NPM_REGISTRY_URL; \
        npm config set @agent-ix:registry $NPM_REGISTRY_URL; \
    fi
COPY package.json pnpm-lock.yaml* .prettierrc .prettierignore eslint.config.js tsconfig.json tsconfig.eslint.json /
WORKDIR /
RUN pnpm install --frozen-lockfile
ENV NODE_PATH=/node_modules
ENV PATH="/node_modules/.bin:$PATH"
WORKDIR /app

# Dev/Runtime stage (Storybook)
FROM deps AS dev
WORKDIR /app
CMD ["pnpm", "storybook", "-p", "6006", "--ci", "--no-open", "--host", "0.0.0.0"]
