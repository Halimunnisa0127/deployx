# Notifications API Reference

All in-app notification endpoints are mounted under `/notifications`.

---

## Endpoints

### 1. List User Notifications

Retrieves the authenticated user's notification list with optional unread filtering.

- **Method**: `GET`
- **Path**: `/notifications`
- **Authentication**: Required (`Bearer <access_token>`)
- **Query Parameters**:
  - `limit` (Optional, number, default: 20)
  - `unreadOnly` (Optional, boolean, default: false)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "_id": "66da729a89c45b001a666666",
      "type": "success",
      "category": "deployment",
      "title": "Deployment #2 Succeeded",
      "message": "Deployment #2 for project My Portfolio App is now live.",
      "unread": true,
      "project": "66da701b89c45b001a222222",
      "deployment": "66da709f89c45b001a333333",
      "actionUrl": "/dashboard/deployments/66da709f89c45b001a333333",
      "createdAt": "2026-09-07T13:11:15.000Z"
    }
  ],
  "statusCode": 200
}
```

---

### 2. Get Unread Count

Returns the total count of unread notifications for badge rendering.

- **Method**: `GET`
- **Path**: `/notifications/unread-count`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Unread count retrieved",
  "data": {
    "count": 3
  },
  "statusCode": 200
}
```

---

### 3. Mark All as Read

Marks all unread notifications for the user as read.

- **Method**: `PATCH`
- **Path**: `/notifications/read-all`
- **Authentication**: Required (`Bearer <access_token>`)

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": null,
  "statusCode": 200
}
```

---

### 4. Mark Notification as Read

Marks an individual notification as read.

- **Method**: `PATCH`
- **Path**: `/notifications/:id/read`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 5. Clear All Notifications

Deletes all notifications for the authenticated user.

- **Method**: `DELETE`
- **Path**: `/notifications`
- **Authentication**: Required (`Bearer <access_token>`)

---

### 6. Delete Notification

Deletes a specific notification by ID.

- **Method**: `DELETE`
- **Path**: `/notifications/:id`
- **Authentication**: Required (`Bearer <access_token>`)
