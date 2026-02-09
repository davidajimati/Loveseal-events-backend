# syntax=docker/dockerfile:1

############################
# Build stage
############################
ARG NODE_VERSION=20.19.0
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

# System deps (for canvas, prisma, etc.)
RUN apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev giflib-dev

# Copy dependency manifests
COPY package.json package-lock.json ./

# Copy Prisma schema BEFORE install and generate client
COPY prisma ./prisma
RUN npm i -g npm@10
RUN npm ci
RUN npx prisma generate

# Copy source & config
COPY src ./src
COPY tsconfig.json ./

# Build the app (creates /dist)
RUN npm run build

# Debug output
RUN echo "===== CURRENT DIR =====" \
 && pwd \
 && echo "===== ROOT CONTENT =====" \
 && ls -la \
 && echo "===== DIST CONTENT =====" \
 && ls -la dist || true \
 && echo "===== DIST TREE =====" \
 && find dist -maxdepth 3 -type f || true


############################
# Runtime stage
############################
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy only what runtime needs
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY package.json ./

EXPOSE 3004

# Add entrypoint script to run migrations and start app
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# ENTRYPOINT handles everything
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]