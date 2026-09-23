# API Reference

Base URL: `http://localhost:5000/api`

All request/response bodies are JSON. Protected routes require `Authorization: Bearer <token>`.

## Auth

### Register
`POST /auth/register` — Public

| Body field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `email` | string | required, valid email |
| `password` | string | required, min 6 chars |

**201 response**
```json
{ "success": true, "data": { "user": { "id": "...", "name": "...", "email": "..." }, "token": "..." } }
```

### Login
`POST /auth/login` — Public

| Body field | Type | Rules |
|---|---|---|
| `email` | string | required |
| `password` | string | required |

**200 response:** same shape as Register. **401** on invalid credentials.

### Get current user
`GET /auth/me` — Protected

**200 response**
```json
{ "success": true, "data": { "id": "...", "name": "...", "email": "..." } }
```

### Logout
`POST /auth/logout` — Protected. Client should discard its stored token; JWTs are stateless so there's nothing to revoke server-side in this implementation.

## Categories

All routes below are **Protected** and scoped to the logged-in user.

| Method | Endpoint | Body | Notes |
|---|---|---|---|
| POST | `/categories` | `{ name, type, color? }` | `type` must be `income` or `expense`. `(userId, name)` must be unique. |
| GET | `/categories` | — | Optional `?type=income\|expense` query filter. |
| PUT | `/categories/:id` | any of `{ name, type, color }` | |
| DELETE | `/categories/:id` | — | **400** if any transaction still references it. |

## Transactions

All routes below are **Protected** and scoped to the logged-in user.

| Method | Endpoint | Body / Query | Notes |
|---|---|---|---|
| POST | `/transactions` | `{ categoryId, amount, description?, date? }` | `type` is derived from the category, not client-supplied. |
| GET | `/transactions` | `?type=&categoryId=&startDate=&endDate=&page=&limit=` | Paginated, newest first. |
| GET | `/transactions/summary` | — | Returns `{ income, expense, balance, byCategory[] }`. |
| PUT | `/transactions/:id` | any of `{ categoryId, amount, description, date }` | |
| DELETE | `/transactions/:id` | — | |

## Error shape

Every error response follows the same shape:
```json
{ "success": false, "message": "Human-readable explanation" }
```
Validation errors additionally include an `errors` array:
```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "Valid email is required" }] }
```