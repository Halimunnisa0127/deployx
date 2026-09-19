# Authentication API Reference

All authentication endpoints are mounted under `/auth`.

---

## Standard Response Format

DeployX returns all responses wrapped in a consistent `ApiResponse` envelope:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2026-09-07T13:00:00.000Z"
}
```

---

## Endpoints

### 1. Register Account

Creates a new user account and returns access and refresh tokens.

- **Method**: `POST`
- **Path**: `/auth/register`
- **Authentication**: None (Public)
- **Rate Limit**: Global API Limit (100 req / 15 min)

#### Request Body
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Validation Rules
- `fullName`: String (min 2 characters).
- `email`: Valid email format.
- `password`: String (min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character).

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "66da6f2a89c45b001a111111",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "isActive": true,
      "authProvider": ["local"],
      "createdAt": "2026-09-07T13:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "statusCode": 201
}
```

#### Error Codes
- `400 Bad Request`: Validation error in payload.
- `409 Conflict`: Email already in use.

---

### 2. Login

Authenticates user credentials and returns tokens along with setting a secure `refreshToken` HTTP-only cookie.

- **Method**: `POST`
- **Path**: `/auth/login`
- **Authentication**: None (Public)

#### Request Body
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "66da6f2a89c45b001a111111",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "lastLogin": "2026-09-07T13:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "statusCode": 200
}
```

#### Error Codes
- `401 Unauthorized`: Invalid credentials or account disabled.

---

### 3. Refresh Access Token

Rotates the user session by issuing a new access token using a valid refresh token.

- **Method**: `POST`
- **Path**: `/auth/refresh-token`
- **Authentication**: Refresh token passed via `refreshToken` Cookie or request body.

#### Request Body (Optional if Cookie is provided)
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "statusCode": 200
}
```

#### Error Codes
- `401 Unauthorized`: Refresh token expired, invalid, or version revoked.

---

### 4. Logout

Invalidates all active refresh tokens for the authenticated user by incrementing `refreshTokenVersion`.

- **Method**: `POST`
- **Path**: `/auth/logout`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "statusCode": 200
}
```

---

### 5. Get Current User (`/me`)

Retrieves the authenticated user's profile and preferences.

- **Method**: `GET`
- **Path**: `/auth/me`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile fetched",
  "data": {
    "_id": "66da6f2a89c45b001a111111",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "avatar": "",
    "bio": "",
    "preferences": {
      "theme": "system",
      "timezone": "UTC",
      "language": "en",
      "emailNotifications": true,
      "marketingEmails": false
    },
    "isActive": true
  },
  "statusCode": 200
}
```

---

### 6. Forgot Password

Generates a 6-digit OTP and sends a password recovery email if the email is registered.

- **Method**: `POST`
- **Path**: `/auth/forgot-password`
- **Authentication**: None (Public)

#### Request Body
```json
{
  "email": "jane@example.com"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "If the email is registered, a password reset OTP has been sent.",
  "data": null,
  "statusCode": 200
}
```

---

### 7. Reset Password

Verifies OTP and resets user password.

- **Method**: `POST`
- **Path**: `/auth/reset-password`
- **Authentication**: None (Public)

#### Request Body
```json
{
  "email": "jane@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword456!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password reset successfully. Please log in with your new password.",
  "data": null,
  "statusCode": 200
}
```

#### Error Codes
- `400 Bad Request`: Invalid OTP, expired OTP, or weak password.
