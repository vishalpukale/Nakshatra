FROM node:18-alpine

WORKDIR /app

# Copy source code
#COPY . .
COPY ./api-gateway ./api-gateway
COPY ./shared ./shared

# Set working directory
WORKDIR /app/shared
RUN npm install

# Set working directory
WORKDIR /app/api-gateway
RUN npm install

# Set environment variables with defaults
ARG ENVIRONMENT=development
ENV ENVIRONMENT=${ENVIRONMENT}
ARG PORT=3000
ENV PORT=${PORT}

# Copy environment-specific file
COPY ./api-gateway/.env.${ENVIRONMENT} .env

# Expose port based on environment
EXPOSE ${PORT}

# Start the service with environment-specific configuration
CMD ["sh", "-c", "node src/server.js"] 