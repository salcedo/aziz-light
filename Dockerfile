FROM oven/bun:latest AS app
WORKDIR /app
COPY . ./
RUN bun install && bun run build

FROM nginxinc/nginx-unprivileged:mainline
COPY --from=app /app/dist /usr/share/nginx/html