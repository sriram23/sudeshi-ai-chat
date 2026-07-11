FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN ["npm", "ci"]

COPY . .

RUN ["npm", "run", "build"]

FROM node:24-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]