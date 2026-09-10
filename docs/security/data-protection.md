# Security: Data Protection & Input Sanitization

This document details the defensive controls implemented in DeployX to protect stored data, validate user inputs, and mitigate common web application vulnerabilities.

---

## 🗄️ Database Field Suppression (`select: false`)

To prevent sensitive authentication fields from leaking during standard queries or serializer passes, Mongoose models explicitly suppress sensitive fields by default:

```javascript
// User Schema Definition
password: {
  type: String,
  select: false // Excluded from User.find() and User.findById()
},
resetPasswordOtp: {
  type: String,
  select: false
},
resetPasswordOtpExpiry: {
  type: Date,
  select: false
}
```

When password verification is explicitly required (such as during login), controllers must deliberately opt-in using `.select('+password')`.

---

## 🛡️ Input Validation with Zod

All incoming API request payloads (body, query parameters, URL path parameters) are strictly validated against strongly-typed Zod schemas prior to hitting controller business logic:

```javascript
// Example validation middleware wrapper
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json(ApiResponse.error('Validation error', error.errors, 400));
  }
};
```

---

## 🌐 HTTP Security Headers (Helmet)

DeployX configures `helmet` in `src/config/security/security.middleware.js` to enforce standard browser security headers:
- `Content-Security-Policy (CSP)`: Restricts script, style, and object execution sources.
- `X-Frame-Options: DENY`: Prevents clickjacking attacks by blocking the dashboard from being embedded in iframes.
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing vulnerabilities.
- `Strict-Transport-Security (HSTS)`: Enforces HTTPS connections in production.

---

## 🛑 Rate Limiting & Anti-Abuse

DeployX enforces two tiers of IP-based rate limiting via `express-rate-limit`:
1. **Global API Limiter**: Capped at 100 requests per 15-minute window.
2. **AI Assistant Limiter**: Capped at 5 requests per 5-minute window to protect external Gemini API quotas and prevent resource exhaustion.
