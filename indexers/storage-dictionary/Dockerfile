FROM node:20-alpine AS node

FROM node AS node-with-gyp
RUN apk add g++ make python3

FROM node-with-gyp AS builder
WORKDIR /squid

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src src
COPY scripts scripts
COPY db db
COPY schema.graphql .
COPY commands.json .
COPY .env .
COPY .env.hydration.self-hosted .

RUN npm ci
RUN npm run build

FROM node-with-gyp AS deps
WORKDIR /squid
COPY ../../package.json .
COPY ../../package-lock.json .
COPY ../../scripts scripts
RUN npm ci --production

FROM node-with-gyp AS squid
WORKDIR /squid

COPY --from=deps /squid/package.json .
COPY --from=deps /squid/package-lock.json .
COPY --from=deps /squid/node_modules node_modules
COPY --from=builder /squid/lib lib
COPY --from=builder /squid/db db
COPY --from=builder /squid/schema.graphql schema.graphql
COPY --from=builder /squid/schema.graphql schema.graphql
COPY --from=builder /squid/scripts scripts
COPY --from=builder /squid/commands.json commands.json
COPY --from=builder /squid/.env .env
COPY --from=builder /squid/.env.hydration.self-hosted .env.hydration.self-hosted

RUN chmod +x scripts/container-entrypoint.sh

RUN echo -e "loglevel=silent\nupdate-notifier=false" > /squid/.npmrc
RUN npm i -g @subsquid/commands && mv $(which squid-commands) /usr/local/bin/sqd

ENV PROCESSOR_PROMETHEUS_PORT 3031
EXPOSE 3031

