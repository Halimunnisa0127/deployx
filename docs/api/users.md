# Users API Reference

All user profile, credential update, and avatar management endpoints are mounted under `/users`.

---

## Endpoints

### 1. Get User Profile

Fetches the authenticated user's profile, preferences, and identity provider details.

- **Method**: `GET`
- **Path**: `/users/me`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "_id": "66da6f2a89c45b001a111111",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "role": "user",
    "avatar": "",
    "bio": "Software Engineer",
    "preferences": {
      "theme": "dark",
      "timezone": "UTC",
      "language": "en",
      "emailNotifications": true,
      "marketingEmails": false
    },
    "isActive": true,
    "authProvider": ["local"]
  },
  "statusCode": 200
}
```

---

### 2. Update User Profile

Updates the user's display name, bio, or UI preferences.

- **Method**: `PATCH`
- **Path**: `/users/me`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "fullName": "Jane Doe",
  "bio": "Full stack engineer building with DeployX.",
  "preferences": {
    "theme": "dark",
    "emailNotifications": false
  }
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... },
  "statusCode": 200
}
```

---

### 3. Update Password

Changes the user's password after verifying the existing current password.

- **Method**: `PATCH`
- **Path**: `/users/password`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewStrongPassword456!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": null,
  "statusCode": 200
}
```

#### Error Codes
- `400 Bad Request`: Current password incorrect or new password does not meet complexity requirements.

---

### 4. Upload Avatar

Uploads or updates the user profile avatar URL.

- **Method**: `POST`
- **Path**: `/users/me/avatar`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "avatar": "https://avatars.githubusercontent.com/u/583231"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "avatar": "https://avatars.githubusercontent.com/u/583231"
  },
  "statusCode": 200
}
```
