FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_AUTHENTICATED_ROUTE
ARG NEXT_PUBLIC_NOT_AUTHENTICATED_ROUTE
ARG NEXT_PUBLIC_ACCESS_TOKEN
ARG NEXT_PUBLIC_URL_API
ARG NEXT_PUBLIC_CLOUDINARY_NAME

ENV NEXT_PUBLIC_AUTHENTICATED_ROUTE=$NEXT_PUBLIC_AUTHENTICATED_ROUTE
ENV NEXT_PUBLIC_NOT_AUTHENTICATED_ROUTE=$NEXT_PUBLIC_NOT_AUTHENTICATED_ROUTE
ENV NEXT_PUBLIC_ACCESS_TOKEN=$NEXT_PUBLIC_ACCESS_TOKEN
ENV NEXT_PUBLIC_URL_API=$NEXT_PUBLIC_URL_API
ENV NEXT_PUBLIC_CLOUDINARY_NAME=$NEXT_PUBLIC_CLOUDINARY_NAME

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./

EXPOSE 4001

CMD ["npm", "run", "start", "--", "-p", "4001"]