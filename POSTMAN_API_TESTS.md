# Postman API Testing Guide

## Base URL
```
https://guidance-language-skills-academy.onrender.com
```

---

## 1. Health Check (Public)

**Request:**
```
GET /api/health
```

**Headers:**
```
Accept: application/json
```

**Expected Response (200):**
```json
{
  "status": "ok",
  "service": "Guidance Academy API",
  "timestamp": "2026-06-17T..."
}
```

---

## 2. Test Registration (Public)

**Request:**
```
POST /api/registrations
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
Origin: https://guidanceacademy.vercel.app
```

**Body (JSON):**
```json
{
  "name_en": "Test Student",
  "name_am": "ፈተና ተማሪ",
  "phone": "0912345678",
  "grade": "Grade 10",
  "purpose": "Language Learning",
  "referral": "Friend",
  "lang": "en"
}
```

**Expected Response (201):**
```json
{
  "message": "Registration successful",
  "data": {
    "id": 1,
    "name_en": "Test Student",
    "name_am": "ፈተና ተማሪ",
    "phone": "0912345678",
    "grade": "Grade 10",
    "status": "pending"
  }
}
```

**CORS Headers to Check:**
```
Access-Control-Allow-Origin: https://guidanceacademy.vercel.app
Access-Control-Allow-Credentials: true
```

---

## 3. Login (Public)

**Request:**
```
POST /api/auth/login
```

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "Admin@2024!"
}
```

**Expected Response (200):**
```json
{
  "token": "1|xxxxxxxxxxxxx...",
  "user": {
    "id": 1,
    "username": "admin",
    "name_en": "Admin User",
    "role": "admin"
  }
}
```

**Save the token for authenticated requests!**

---

## 4. Get Current User (Authenticated)

**Request:**
```
GET /api/auth/me
```

**Headers:**
```
Accept: application/json
Authorization: Bearer {YOUR_TOKEN}
```

**Expected Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "name_en": "Admin User",
  "role": "admin"
}
```

---

## 5. Get Promotional Images (Public)

**Request:**
```
GET /api/promotional-images
```

**Headers:**
```
Accept: application/json
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Summer Course 2024",
      "image_url": "/storage/promotional_images/xyz.jpg",
      "description": "Join our summer program",
      "display_order": 0,
      "is_active": true
    }
  ]
}
```

**Note:** Returns empty array if no images uploaded yet.

---

## 6. Get Admin Students (Admin Only)

**Request:**
```
GET /api/admin/students
```

**Headers:**
```
Accept: application/json
Authorization: Bearer {YOUR_TOKEN}
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name_en": "Test Student",
      "phone": "0912345678",
      "status": "pending",
      "created_at": "2026-06-17T..."
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 1
  }
}
```

---

## 7. Upload Promotional Image (Admin Only)

**Request:**
```
POST /api/admin/promotional-images
```

**Headers:**
```
Accept: application/json
Authorization: Bearer {YOUR_TOKEN}
```

**Body (form-data):**
```
image: [Select file - JPG/PNG]
title: Summer Course 2024
description: Join our amazing summer program
display_order: 0
```

**Expected Response (201):**
```json
{
  "message": "Image uploaded successfully",
  "data": {
    "id": 1,
    "title": "Summer Course 2024",
    "image_url": "/storage/promotional_images/xyz.jpg",
    "is_active": true
  }
}
```

---

## 8. Get Admin Promotional Images (Admin Only)

**Request:**
```
GET /api/admin/promotional-images
```

**Headers:**
```
Accept: application/json
Authorization: Bearer {YOUR_TOKEN}
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Summer Course 2024",
      "image_url": "/storage/promotional_images/xyz.jpg",
      "description": "Join our amazing summer program",
      "display_order": 0,
      "is_active": true,
      "created_at": "2026-06-17T..."
    }
  ]
}
```

---

## 9. Toggle Promotional Image Status (Admin Only)

**Request:**
```
PATCH /api/admin/promotional-images/1/toggle
```

**Headers:**
```
Accept: application/json
Authorization: Bearer {YOUR_TOKEN}
```

**Expected Response (200):**
```json
{
  "message": "Image status updated",
  "data": {
    "id": 1,
    "is_active": false
  }
}
```

---

## 10. Delete Promotional Image (Admin Only)

**Request:**
```
DELETE /api/admin/promotional-images/1
```

**Headers:**
```
Accept: application/json
Authorization: Bearer {YOUR_TOKEN}
```

**Expected Response (200):**
```json
{
  "message": "Image deleted successfully"
}
```

---

## 11. Get Posts (Public)

**Request:**
```
GET /api/posts
```

**Headers:**
```
Accept: application/json
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title_en": "Welcome",
      "title_am": "እንኳን ደህና መጡ",
      "body_en": "Welcome to our academy...",
      "body_am": "ወደ አካዴሚያችን እንኳን ደህና መጡ...",
      "type": "announcement",
      "created_at": "2026-06-17T..."
    }
  ]
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden (Not Admin)
```json
{
  "message": "Forbidden. Admin access required."
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name_en": ["The name en field is required."]
  }
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

---

## Testing Order

1. **Test Health** - Verify API is running
2. **Test CORS** - Check preflight and headers
3. **Test Registration** - Public endpoint
4. **Test Login** - Get admin token
5. **Test Auth Check** - Verify token works
6. **Test Admin Students** - Check admin access
7. **Test Promo Upload** - Upload test image
8. **Test Public Promo** - Verify image is public
9. **Test Toggle/Delete** - Manage images

---

## CORS Preflight Test

**Request:**
```
OPTIONS /api/registrations
```

**Headers:**
```
Origin: https://guidanceacademy.vercel.app
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

**Expected Response (204):**
```
Access-Control-Allow-Origin: https://guidanceacademy.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

---

## Import to Postman

1. Create new Collection: "Guidance Academy API"
2. Set Collection Variable: `base_url` = `https://guidance-language-skills-academy.onrender.com`
3. Set Collection Variable: `token` = (empty, fill after login)
4. Add all endpoints above
5. Use `{{base_url}}` and `{{token}}` variables

---

**Last Updated**: June 17, 2026
