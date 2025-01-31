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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder ./frontend/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs ./frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs ./frontend/.next/static ./.next/static

USER nextjs

ENV PORT=4000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
