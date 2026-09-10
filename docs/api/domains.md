# Domains API Reference

All custom domain and DNS verification endpoints are mounted under `/domains`.

---

## Endpoints

### 1. List User Domains

Retrieves all custom domains registered across all projects for the authenticated user.

- **Method**: `GET`
- **Path**: `/domains`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Domains retrieved successfully",
  "data": [
    {
      "_id": "66da71ff89c45b001a555555",
      "project": "66da701b89c45b001a222222",
      "hostname": "app.example.com",
      "verificationStatus": "verified",
      "status": "active",
      "targetType": "production",
      "sslStatus": "active",
      "verifiedAt": "2026-09-07T13:20:00.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 2. Register Custom Domain

Registers a new custom domain hostname and generates a cryptographic verification challenge token.

- **Method**: `POST`
- **Path**: `/domains`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "projectId": "66da701b89c45b001a222222",
  "hostname": "app.example.com",
  "targetType": "production"
}
```

#### Validation Rules
- `hostname`: Valid lowercase fully qualified domain name (FQDN).
- `targetType`: Optional, enum: `production` or `deployment` (Default: `production`).

#### Response (`201 Created`)
```json
{
  "success": true,
  "message": "Domain registered successfully. Please configure DNS verification.",
  "data": {
    "_id": "66da71ff89c45b001a555555",
    "hostname": "app.example.com",
    "verificationStatus": "pending",
    "status": "pending",
    "verificationToken": "dx_ver_9a8b7c6d5e4f3a2b1c0d",
    "createdAt": "2026-09-07T13:18:00.000Z"
  },
  "statusCode": 201
}
```

---

### 3. Get Project Domains

Fetches all custom domains attached to a specific project.

- **Method**: `GET`
- **Path**: `/domains/project/:projectId`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 4. Get Domain Details

Fetches metadata for a specific domain. Sensitive verification tokens are suppressed for security.

- **Method**: `GET`
- **Path**: `/domains/:id`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 5. Get DNS Verification Instructions

Retrieves the exact DNS records (TXT, CNAME, A) required to verify domain ownership.

- **Method**: `GET`
- **Path**: `/domains/:id/instructions`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Domain DNS instructions retrieved",
  "data": {
    "hostname": "app.example.com",
    "records": [
      {
        "type": "TXT",
        "name": "_deployx-challenge.app.example.com",
        "value": "deployx-verification=dx_ver_9a8b7c6d5e4f3a2b1c0d",
        "purpose": "Ownership Verification"
      },
      {
        "type": "CNAME",
        "name": "app.example.com",
        "value": "cname.deployx.app",
        "purpose": "Traffic Routing"
      },
      {
        "type": "A",
        "name": "app.example.com",
        "value": "76.76.21.21",
        "purpose": "Apex Routing (Alternative to CNAME)"
      }
    ]
  },
  "statusCode": 200
}
```

---

### 6. Verify Domain DNS

Triggers active DNS resolution for TXT records to confirm ownership.

- **Method**: `POST`
- **Path**: `/domains/:id/verify`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK - Verified`)
```json
{
  "success": true,
  "message": "DNS verification completed successfully.",
  "data": {
    "verified": true,
    "verificationStatus": "verified",
    "message": "DNS verification completed successfully."
  },
  "statusCode": 200
}
```

#### Response (`200 OK - Verification Failed`)
```json
{
  "success": false,
  "message": "DNS verification record was not found.",
  "data": {
    "verified": false,
    "verificationStatus": "failed",
    "message": "DNS verification record was not found."
  },
  "statusCode": 200
}
```

---

### 7. Update Domain Routing Target

Switches the domain target between production deployment and a specific deployment ID.

- **Method**: `PATCH`
- **Path**: `/domains/:id/target`
- **Authentication**: Required (`Bearer <access_token>`)

#### Request Body
```json
{
  "targetType": "deployment",
  "targetDeployment": "66da709f89c45b001a333333"
}
```

---

### 8. Delete Custom Domain

Removes the custom domain from DeployX routing tables.

- **Method**: `DELETE`
- **Path**: `/domains/:id`
- **Authentication**: Required (`Bearer <access_token>`)
