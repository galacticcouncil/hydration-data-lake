# Base image
FROM node:20 AS builder

# Create app directory
WORKDIR /opt/hdl-health-checker

COPY  . .

RUN yarn install
RUN yarn build

FROM node:20-slim AS runner

WORKDIR /opt/hdl-health-checker

COPY --from=builder /opt/hdl-health-checker .
