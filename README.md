# 📦 ML Verification

Email verification service built with NestJS. Provides secure email verification with code-based authentication, expiration handling, and attempt limiting.

## 🚀 Features

- Email verification with 6-digit code
- Code expiration (10 minutes TTL)
- Attempt limiting (max 5 attempts)
- Status tracking (PENDING, VERIFIED, FAILED, EXPIRED)
- Development mode support (returns code in response when email is not configured)
- In-memory storage (easily replaceable with database)

## 🛠 Technologies

- **NestJS** 11 - Progressive Node.js framework
- **TypeScript** 5.7
- **Nodemailer** - Email sending
- **class-validator** - DTO validation
- **uuid** - Unique identifier generation

## 📋 Requirements

- Node.js >= 18
- yarn (package manager)
- SMTP server credentials (optional for development)

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/username/ml-verification.git
cd ml-verification

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env

# Edit .env file with your SMTP settings (optional for development)

# Start the application
yarn start:dev
```

The application will be available at `http://localhost:3000`

## 🔧 Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` | No* |
| `EMAIL_PORT` | SMTP server port | `587` | No* |
| `EMAIL_USER` | SMTP username/email | `user@example.com` | No* |
| `EMAIL_PASSWORD` | SMTP password or app password | `your_password` | No* |
| `EMAIL_FROM` | Sender email address | `noreply@example.com` | No* |

\* *Required only if you want to send real emails. In development mode, the service will return the verification code in the response.*

### SMTP Configuration Examples

**Gmail:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```
*Note: For Gmail, you need to use an [App Password](https://myaccount.google.com/apppasswords), not your regular password.*

**Mailtrap (for testing):**
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_FROM=noreply@example.com
```

**Yandex:**
```env
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=465
EMAIL_USER=your_email@yandex.ru
EMAIL_PASSWORD=your_password
EMAIL_FROM=your_email@yandex.ru
```

## 📁 Project Structure

```
src/
├── verification/          # Verification module
│   ├── dto/              # Data Transfer Objects
│   │   ├── request-verification.dto.ts
│   │   └── confirm-verification.dto.ts
│   ├── entities/         # Domain entities
│   │   └── verification.entity.ts
│   ├── enums/           # Enumerations
│   │   └── verification-status.enum.ts
│   ├── repositories/    # Repository pattern
│   │   ├── verification.repository.ts
│   │   └── in-memory-verification.repository.ts
│   ├── verification.controller.ts
│   ├── verification.service.ts
│   └── verification.module.ts
├── mail/                # Email module
│   ├── templates/       # Email templates
│   │   └── email-verification.template.ts
│   ├── mail.service.ts
│   └── mail.module.ts
├── app.module.ts
└── main.ts
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Start the application |
| `yarn start:dev` | Start in development mode with watch |
| `yarn start:debug` | Start in debug mode |
| `yarn start:prod` | Start in production mode |
| `yarn build` | Build the project |
| `yarn test` | Run unit tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:cov` | Run tests with coverage |
| `yarn test:e2e` | Run end-to-end tests |
| `yarn lint` | Run ESLint |
| `yarn format` | Format code with Prettier |

## 📖 API Documentation

### Base URL

All endpoints are prefixed with `/api`

### Endpoints

#### Request Verification

**POST** `/api/verification/request`

Request a verification code for an email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "verificationId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-05T21:36:29.000Z"
}
```

**Response (Development mode - email not configured):**
```json
{
  "verificationId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-01-05T21:36:29.000Z",
  "code": "123456"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format
- `400 Bad Request` - Failed to send verification email (if SMTP configured but failed)

#### Confirm Verification

**POST** `/api/verification/confirm`

Confirm verification with code.

**Request Body:**
```json
{
  "verificationId": "550e8400-e29b-41d4-a716-446655440000",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "status": "VERIFIED"
}
```

**Possible Status Values:**
- `PENDING` - Verification in progress
- `VERIFIED` - Successfully verified
- `FAILED` - Maximum attempts exceeded
- `EXPIRED` - Code expired

**Error Responses:**
- `400 Bad Request` - Invalid code
- `404 Not Found` - Verification not found

### Example Usage

**Using cURL:**

```bash
# Request verification
curl -X POST http://localhost:3000/api/verification/request \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Confirm verification
curl -X POST http://localhost:3000/api/verification/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "verificationId": "550e8400-e29b-41d4-a716-446655440000",
    "code": "123456"
  }'
```

**Using Postman:**

1. Create a POST request to `http://localhost:3000/api/verification/request`
2. Set `Content-Type: application/json` in headers
3. Send JSON body with `email` field
4. Copy `verificationId` and `code` from response
5. Create a POST request to `http://localhost:3000/api/verification/confirm`
6. Send JSON body with `verificationId` and `code`

## 🔒 Security Features

- **Code Expiration**: Verification codes expire after 10 minutes
- **Attempt Limiting**: Maximum 5 attempts per verification
- **Code Cleanup**: Verification code is cleared after successful verification
- **Status Tracking**: Prevents reuse of verified/failed/expired verifications

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov

# Run end-to-end tests
yarn test:e2e
```

## 🏗 Architecture

The project follows clean architecture principles:

- **Repository Pattern**: Abstract storage layer (currently in-memory, easily replaceable with database)
- **Service Layer**: Business logic separation
- **DTO Validation**: Input validation using class-validator
- **Module-based**: Modular structure for scalability

## 🔄 Development Mode

When email is not configured (no SMTP credentials), the service operates in development mode:

- Verification codes are returned in the API response
- No actual emails are sent
- Useful for local development and testing

To enable development mode, simply don't set the email environment variables or use test values like `smtp.example.com`.

## 📝 TODO

- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Add rate limiting
- [ ] Add Redis for distributed storage
- [ ] Add email template customization
- [ ] Add webhook support
- [ ] Add metrics and monitoring
- [ ] Add comprehensive test coverage

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.
