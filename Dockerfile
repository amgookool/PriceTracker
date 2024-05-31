# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
ARG VERSION=latest
ARG PORT=2500
FROM oven/bun:${VERSION} as base
ENV DATABASE=${DATABASE}
WORKDIR /app
COPY . .
RUN mkdir -p data
RUN touch data/pricetracker.sqlite
RUN cd frontend && bun install && bun run build && rm -rf node_modules && rm -rf src && rm -rf public && rm -f *.json && rm -f *.ts && rm -f *.cjs 
RUN bun install
EXPOSE ${PORT}
CMD ["bun", "run", "index.ts"]
