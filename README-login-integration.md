# Login Backend Integration Notes

This file contains the required placeholders for connecting the frontend login page to the backend.

## 1) VPN and backend connection

Ask backend team for:
- VPN IP / VPN hostname
- VPN port
- whether the environment is DEV, QA, or PROD
- whether the API is reachable from browser via HTTPS
- any certificate or SSH tunnel requirement

Example:
- VPN IP: 10.20.30.40
- Port: 8443
- Base URL: https://10.20.30.40:8443

## 2) Login endpoint

Ask backend team for the exact login endpoint and method.

Examples:
- POST /api/auth/login
- POST /api/v1/login
- POST /api/user/login

## 3) Request body

Request body should match the backend contract. Usually:

```json
{
  "username": "rahul",
  "password": "password123",
  "role": "EMPLOYEE"
}
```

But confirm the exact field names with backend team.

## 4) Response schema

Ask backend team for the exact JSON response shape.

Typical response example:

```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "username": "rahul",
    "role": "EMPLOYEE"
  },
  "modules": ["search", "upload"],
  "permissions": ["read", "write"]
}
```

## 5) File upload and other backend APIs

The same approach should be used for all other APIs:
- create base URL from VPN values
- use exact endpoint path
- pass auth header if required
- parse response JSON according to backend contract

## 6) How to use the current frontend integration scaffold

- Update `.env.local` using `.env.example`
- Update `src/services/authService.js`
- Replace mock data return with actual fetch call
- Confirm auth headers and token handling
- Test with real backend credentials

## 7) Notes for secure implementation

- Do not store raw password in localStorage
- Use secure token/session handling according to backend design
- Use HTTPS only
- Add proper error handling for login failure
- For protected routes, check auth state before navigation
