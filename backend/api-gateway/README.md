# Authentication Service

A robust authentication service built with Node.js, Express, and PostgreSQL using Drizzle ORM.

## Features

- User authentication and authorization
- JWT-based token management
- Secure password hashing with bcrypt
- Database migrations and schema management
- API documentation with Swagger/OpenAPI
- Logging system with Winston
- Email notifications
- SMS integration
- File upload capabilities
- Security features (Helmet, CORS, etc.)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd auth-service
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# DB Configurations
DB_HOST=your_db_host
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_LOGGING=true
DB_SSL=false
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# Mail Configurations
MAIL_HOST=your_mail_host
MAIL_FROM=your_mail_from
MAIL_PORT=25
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_password

# SMS Configurations
SMS_API_KEY=your_sms_api_key
SMS_SENDER=your_sms_sender

# Runtime Configs
PORT=5001
SECRET_JWT=your_jwt_secret
```

## Database Setup

1. Generate database migrations:

```bash
npm run db:generate
```

2. Apply migrations:

```bash
npm run db:migrate
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations

## Project Structure

```
auth-service/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── db/            # Database related files
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── server.js      # Application entry point
├── .env               # Environment variables
├── drizzle.config.js  # Drizzle ORM configuration
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- Secure password hashing
- JWT token-based authentication

## Logging

The application uses Winston for logging with the following features:

- Daily rotating file logs
- Console logging in development
- Different log levels for different environments
- Request logging with Morgan

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MM License.
