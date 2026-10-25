# Registration Service

Microservice for managing student event registrations.

## Features

- Country and State management
- Event management
- Dynamic registration forms with custom fields
- Student registration management
- Payment status tracking

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the registration-service directory with the following variables:
```
PORT=3335
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=registration_db
DB_SSL=false
DB_LOGGING=true

SECRET_JWT=your-secret-jwt-key-change-this-in-production
SECRET_CRYPTO=your-secret-crypto-key-change-this-in-production
SESSION_SECRET=your-session-secret-change-this-in-production
```

3. Create the database in PostgreSQL:
```sql
CREATE DATABASE registration_db;
```

4. Run migrations (if using Drizzle migrations):
```bash
npm run db:migrate
```

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The service will run on `http://localhost:3335`

## API Endpoints

### Countries
- `GET /api/registration/countries` - Get all countries
- `POST /api/registration/countries` - Create a country (requires auth)

### States
- `GET /api/registration/states?countryId={id}` - Get all states (optionally filtered by country)
- `POST /api/registration/states` - Create a state (requires auth)

### Events
- `GET /api/registration/events?stateId={id}` - Get all events (optionally filtered by state)
- `GET /api/registration/events/:id` - Get event by ID
- `POST /api/registration/events` - Create an event (requires auth)
- `PUT /api/registration/events/:id` - Update an event (requires auth)

### Registration Forms
- `GET /api/registration/registration-forms?eventId={id}&stateId={id}` - Get all registration forms
- `GET /api/registration/registration-forms/:id` - Get registration form by ID (includes fields)
- `POST /api/registration/registration-forms` - Create a registration form (requires auth)
- `PUT /api/registration/registration-forms/:id` - Update a registration form (requires auth)

### Registrations
- `GET /api/registration/registrations?eventId={id}&stateId={id}` - Get all registrations (requires auth)
- `GET /api/registration/registrations/:id` - Get registration by ID (requires auth)
- `POST /api/registration/registrations` - Create a registration (public endpoint)
- `PUT /api/registration/registrations/:id` - Update a registration (requires auth)
- `PATCH /api/registration/registrations/:id/payment-status` - Update payment status (requires auth)

## Database Schema

The service uses the following main tables:
- `countries` - Country information
- `states` - State/Province information
- `events` - Event information
- `registration_forms` - Registration form templates
- `registration_form_fields` - Dynamic form fields
- `registrations` - Student registrations
- `registration_answers` - Answers to form fields

## Notes

- All timestamps use `TIMESTAMP` for timezone support
- Soft deletes are implemented using `isDeleted` flag
- Active/inactive status is managed using `isActive` flag
- Payment status can be: `pending`, `paid`, `failed`, `refunded`

