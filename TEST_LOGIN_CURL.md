# Test Login with Curl

Run this command to see the actual error message from the login endpoint:

```bash
curl -X POST https://guidance-language-skills-academy.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"username":"admin","password":"Admin@2024!"}'
```

This will show the full error response since APP_DEBUG=true is enabled.

## Alternative: Test with a newly registered user

If you just registered a new user (registration_id: 5), first create an account:

```bash
curl -X POST https://guidance-language-skills-academy.onrender.com/api/auth/setup \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "registration_id": 5,
    "username": "testuser",
    "password": "Test@1234",
    "password_confirmation": "Test@1234"
  }'
```

Then try to login:

```bash
curl -X POST https://guidance-language-skills-academy.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"username":"testuser","password":"Test@1234"}'
```

## What to look for

The response should include:
- `message`: The error description
- `error`: Object with exception details (since debug mode is on)
  - `exception`: The exception class name
  - `file`: Which file caused the error
  - `line`: Line number of the error

Share the full output here so we can identify the root cause.
