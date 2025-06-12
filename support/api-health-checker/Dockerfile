# Base image
FROM node:20 AS builder

# Create app directory
WORKDIR /opt/hdl-health-checker

COPY  . .

RUN npm install
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /opt/hdl-health-checker

COPY --from=builder /opt/hdl-health-checker .
