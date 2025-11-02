# Admin Account Setup

This guide explains how to create your first admin account for the Daddy Jobe Comprehensive School website.

## Method 1: Using the Setup API Endpoint (Recommended)

The `/api/auth/setup` endpoint allows you to create the first admin account. Once an admin exists, this endpoint is disabled.

### Step 1: Make a POST request to the setup endpoint

You can use any of the following methods:

#### Option A: Using cURL (Command Line)

```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@daddyjobe.edu.gm",
    "password": "YourSecurePassword123!",
    "name": "Admin User"
  }'
```

#### Option B: Using PowerShell (Windows)

```powershell
$body = @{
    email = "admin@daddyjobe.edu.gm"
    password = "YourSecurePassword123!"
    name = "Admin User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/setup" -Method Post -Body $body -ContentType "application/json"
```

#### Option C: Using Browser Developer Tools

1. Open your browser and navigate to `http://localhost:3000/admin/login`
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Run this JavaScript:

```javascript
fetch('/api/auth/setup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@daddyjobe.edu.gm',
    password: 'YourSecurePassword123!',
    name: 'Admin User'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

#### Option D: Using a REST Client (Postman, Insomnia, etc.)

1. Set method to `POST`
2. URL: `http://localhost:3000/api/auth/setup`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "email": "admin@daddyjobe.edu.gm",
  "password": "YourSecurePassword123!",
  "name": "Admin User"
}
```

### Step 2: Verify the account was created

You should receive a success response:
```json
{
  "success": true,
  "message": "Admin account created successfully. Please use the login endpoint to sign in.",
  "user": {
    "id": "...",
    "email": "admin@daddyjobe.edu.gm",
    "name": "Admin User",
    "role": "super_admin"
  }
}
```

### Step 3: Login

1. Navigate to `http://localhost:3000/admin/login`
2. Enter your email and password
3. Click "Sign In"

---

## Method 2: Using Prisma Studio (Alternative)

If you prefer a GUI approach:

1. Install Prisma Studio (if not already installed):
   ```bash
   npx prisma studio
   ```

2. Open `http://localhost:5555` in your browser

3. Navigate to the `Admin` table

4. Click "Add record" and create an admin with:
   - `email`: Your email address
   - `password`: **Hashed password** (see below for how to generate)
   - `name`: Your name
   - `role`: `admin` or `super_admin`

5. **Important**: The password must be hashed using bcrypt. Use one of these methods:

#### Generate Hashed Password (Node.js)

Run this in Node.js:
```javascript
const bcrypt = require('bcryptjs');
const password = 'YourSecurePassword123!';
bcrypt.hash(password, 12).then(hash => console.log(hash));
```

Or using a simple script:

Create a file `hash-password.js`:
```javascript
const bcrypt = require('bcryptjs');
const password = process.argv[2] || 'YourSecurePassword123!';

bcrypt.hash(password, 12).then(hash => {
  console.log('Password:', password);
  console.log('Hashed:', hash);
  console.log('\nCopy the hash value above to use in Prisma Studio.');
});
```

Run it:
```bash
node hash-password.js "YourSecurePassword123!"
```

---

## Default Admin Credentials (For Development)

**⚠️ IMPORTANT: Change these immediately in production!**

```
Email: admin@daddyjobe.edu.gm
Password: Admin123!@#
```

You can use these credentials for initial setup, but make sure to:
1. Change the password after first login
2. Use a strong, unique password in production
3. Never commit these credentials to version control

---

## Security Notes

1. **First Admin**: The first admin created via `/api/auth/setup` will have `super_admin` role
2. **Subsequent Admins**: After the first admin exists, the setup endpoint is disabled. Create additional admins through the database or a separate admin management interface.
3. **Password Requirements**: 
   - Minimum 8 characters
   - Use strong passwords with mixed case, numbers, and special characters
4. **Rate Limiting**: The setup endpoint is rate-limited to 1 request per hour to prevent abuse
5. **Environment Variables**: Make sure `JWT_SECRET` is set in your `.env` file (generate with: `openssl rand -base64 32`)

---

## Troubleshooting

### "Setup already completed" error

This means an admin account already exists. You should:
1. Use the login endpoint instead (`/api/auth/login`)
2. Or reset the database if you're in development:
   ```bash
   npx prisma migrate reset
   ```

### "Too many requests" error

The setup endpoint is rate-limited. Wait 1 hour before trying again, or reset the rate limit by restarting the development server.

### "Validation failed" error

Check that:
- Email is a valid email address
- Password is at least 8 characters
- Name is at least 2 characters
- All fields are provided

---

## Next Steps

After creating your admin account:

1. **Login** at `http://localhost:3000/admin/login`
2. **Access the Admin Dashboard** at `http://localhost:3000/admin/activities`
3. **View User Activities** and export CSV files
4. **Logout** when done (button in top right of dashboard)

---

For more information, see the main [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) file.

