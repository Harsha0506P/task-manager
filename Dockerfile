FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules

COPY server.js ./
COPY views ./views
COPY public ./public

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
