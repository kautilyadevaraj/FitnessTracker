# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app

# Install required packages (like for Prisma)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./

# --force for React 19 peer conflicts
RUN npm install --force

# Build the app
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
