FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /frontend

COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile 

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /frontend
COPY --from=deps ./frontend/node_modules ./node_modules
COPY ./frontend .

ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build;

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /frontend

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 nextjs

COPY --from=builder ./frontend/public ./public

COPY --from=builder --chown=nextjs:nodejs ./frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ./frontend/.next/static ./.next/static

RUN mkdir /data
RUN chown -R nextjs:nodejs /data
RUN chmod -R u+rw /data

USER nextjs

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
