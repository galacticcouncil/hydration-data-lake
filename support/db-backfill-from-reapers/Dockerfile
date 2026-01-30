FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY index.js ./
COPY config.js ./
#COPY ./reapers-list.json ./
COPY utils/ ./utils/
COPY database/ ./database/
COPY services/ ./services/