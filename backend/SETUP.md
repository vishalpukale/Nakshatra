# Setup Guide

## Quick Start

### 1. Database Setup

Create the PostgreSQL database in DBeaver or using psql:

```sql
CREATE DATABASE registration_db;
```

Update the database credentials in:
- `postgres.env` (if using Docker)
- `registration-service/.env` (copy from `.env.example`)

### 2. Install Dependencies

```bash
# Install shared dependencies
cd shared
npm install

# Install registration service dependencies
cd ../registration-service
npm install

# Install API gateway dependencies
cd ../api-gateway
npm install
```

### 3. Configure Environment Variables

Copy the example env file and update with your database credentials:

```bash
cd registration-service
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run Database Migrations

The database tables will be created automatically when you start the service. If you need to run migrations manually:

```bash
cd registration-service
npm run db:migrate
```

### 5. Start Services

#### Start Registration Service:
```bash
cd registration-service
npm run dev
```

Service will run on: `http://localhost:3335`

#### Start API Gateway (optional):
```bash
cd api-gateway
npm run dev
```

Gateway will run on: `http://localhost:3330`

## Database Tables

The following tables will be created:

1. **countries** - Country information
   - id, name, code, is_active, is_deleted, created_by, updated_by, created_at, updated_at

2. **states** - State/Province information
   - id, country_id, name, code, is_active, is_deleted, created_by, updated_by, created_at, updated_at

3. **events** - Event information
   - id, state_id, name, code, description, payment_required, price, currency, is_active, is_deleted, created_at, updated_at

4. **registration_forms** - Registration form templates
   - id, state_id, event_id, name, is_default, is_active, is_deleted, created_at, updated_at

5. **registration_form_fields** - Dynamic form fields
   - id, form_id, field_key, label, input_type, is_required, sort_order, options, created_at, updated_at

6. **registrations** - Student registrations
   - id, event_id, state_id, form_id, full_name, email, phone, total_amount, payment_status, is_active, is_deleted, created_at, updated_at

7. **registration_answers** - Answers to form fields
   - id, registration_id, field_id, value, created_at

## Testing the API

### Get Countries
```bash
curl http://localhost:3335/api/registration/countries
```

### Get States
```bash
curl http://localhost:3335/api/registration/states?countryId=1
```

### Create Event
```bash
curl -X POST http://localhost:3335/api/registration/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Tech Conference 2024",
    "code": "TECH2024",
    "stateId": 1,
    "paymentRequired": true,
    "price": 1000.00,
    "currency": "INR"
  }'
```

### Create Registration (Public)
```bash
curl -X POST http://localhost:3335/api/registration/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": 1,
    "formId": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "answers": [
      {
        "fieldId": 1,
        "value": "John"
      },
      {
        "fieldId": 2,
        "value": "Doe"
      }
    ]
  }'
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database `registration_db` exists
- Check if port 5432 is available

### Port Already in Use
- Change `PORT` in `.env` file
- Kill the process using the port: `lsof -ti:3335 | xargs kill`

### Module Not Found Errors
- Run `npm install` in each service directory
- Ensure `shared` package is installed: `cd shared && npm install`

## Next Steps

1. Create countries and states in the database
2. Create events for registration
3. Create registration forms with custom fields
4. Test student registration flow
5. Integrate with frontend application

