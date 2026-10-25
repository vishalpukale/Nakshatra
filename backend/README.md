# Backend Services

This repository contains microservices for the application backend.

## Services

### Registration Service
Microservice for managing student event registrations.

**Port:** 3335

See [registration-service/README.md](./registration-service/README.md) for details.

### API Gateway
Gateway service that routes requests to appropriate microservices.

**Port:** 3330

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create the database:
```sql
CREATE DATABASE registration_db;
```

2. Update database credentials in:
   - `postgres.env` (for Docker if using)
   - `registration-service/.env`

### Installation

1. Install shared dependencies:
```bash
cd shared
npm install
```

2. Install registration service dependencies:
```bash
cd registration-service
npm install
```

3. Install API gateway dependencies:
```bash
cd api-gateway
npm install
```

### Running Services

#### Registration Service
```bash
cd registration-service
npm run dev
```

#### API Gateway
```bash
cd api-gateway
npm run dev
```

### Environment Variables

Each service requires a `.env` file. See individual service READMEs for required variables.

### Database Migrations

The registration service uses Drizzle ORM. To generate migrations:
```bash
cd registration-service
npm run db:generate
```

To run migrations:
```bash
npm run db:migrate
```

## Project Structure

```
backend/
├── api-gateway/          # API Gateway service
├── registration-service/ # Registration microservice
├── shared/               # Shared models and utilities
│   └── models/          # Database models (JavaScript)
└── postgres.env         # PostgreSQL environment variables
```

## API Documentation

API documentation is available at:
- API Gateway: `http://localhost:3330/api-docs`

## Notes

- All services use the shared models from the `shared/models` folder to avoid circular dependencies
- Database credentials should be updated in `.env` files for local development
- For production, ensure all secrets are properly configured
