# Library Stock Management API - Testing Examples

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except login) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 1. Authentication

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@library.com",
  "password": "admin123"
}
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

## 2. Books

### Get All Books (with pagination and filtering)
```bash
GET /api/books?page=1&limit=10&search=javascript&category=Technology
Authorization: Bearer <token>
```

### Get Single Book
```bash
GET /api/books/:id
Authorization: Bearer <token>
```

### Create Book (with image upload)
```bash
POST /api/books
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "JavaScript: The Good Parts"
author: "Douglas Crockford"
category: "Technology"
ISBN: "978-0596517748"
quantity: 10
coverImage: [file]
```

### Update Book
```bash
PUT /api/books/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

title: "JavaScript: The Good Parts (Updated)"
author: "Douglas Crockford"
category: "Technology"
ISBN: "978-0596517748"
quantity: 15
coverImage: [file] (optional)
```

### Delete Book
```bash
DELETE /api/books/:id
Authorization: Bearer <token>
```

### Add Stock
```bash
PATCH /api/books/:id/add-stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

### Remove Stock
```bash
PATCH /api/books/:id/remove-stock
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

## 3. Stock Management

### Get Stock Logs
```bash
GET /api/stock/logs?page=1&limit=20&bookId=60f7b3b3b3b3b3b3b3b3b3b3&action=add&startDate=2023-01-01&endDate=2023-12-31
Authorization: Bearer <token>
```

### Get Stock Summary
```bash
GET /api/stock/summary
Authorization: Bearer <token>
```

## 4. Borrow System

### Create Borrow Record
```bash
POST /api/borrow
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "userId": "60f7b3b3b3b3b3b3b3b3b3b4",
  "dueDate": "2023-12-31T23:59:59.000Z"
}
```

### Return Book
```bash
PATCH /api/borrow/return/:id
Authorization: Bearer <token>
```

### Get All Borrow Records
```bash
GET /api/borrow?page=1&limit=20&userId=60f7b3b3b3b3b3b3b3b3b3b4&status=borrowed
Authorization: Bearer <token>
```

### Get Overdue Books
```bash
GET /api/borrow/overdue?page=1&limit=20
Authorization: Bearer <token>
```

### Update Overdue Status
```bash
PATCH /api/borrow/update-overdue
Authorization: Bearer <token>
```

## 5. Users

### Get All Users
```bash
GET /api/users?page=1&limit=20&role=staff&search=john
Authorization: Bearer <token>
```

### Get Single User
```bash
GET /api/users/:id
Authorization: Bearer <token>
```

### Create User
```bash
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "staff"
}
```

### Update User
```bash
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin",
  "password": "newpassword123"
}
```

### Delete User
```bash
DELETE /api/users/:id
Authorization: Bearer <token>
```

## 6. Health Check

### API Health
```bash
GET /api/health
```

## Postman Collection Example

```json
{
  "info": {
    "name": "Library Stock Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@library.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
