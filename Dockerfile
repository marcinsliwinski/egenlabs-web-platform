# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1 \
    NPM_CONFIG_UPDATE_NOTIFIER=false

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN PRISMA_SKIP_POSTINSTALL_GENERATE=true npm ci

COPY prisma ./prisma
RUN npm run prisma:generate

COPY . .
RUN chown -R node:node /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
