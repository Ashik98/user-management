# 🚀 User Management Backend with RBAC

A complete, production-ready Node.js backend system with TypeScript, featuring user management, role-based access control (RBAC), and JWT authentication.

## 📋 Features

- ✅ **JWT Authentication** - Access & Refresh tokens
- ✅ **OAuth 2.0 Grant Types** - Password, Refresh Token, Client Credentials
- ✅ **Role-Based Access Control (RBAC)** - Flexible permission system
- ✅ **User Management** - Complete CRUD operations
- ✅ **PostgreSQL Database** - Using TypeORM with Code-First approach
- ✅ **API Documentation** - Interactive Swagger UI
- ✅ **Security** - Helmet, CORS, Rate Limiting
- ✅ **Validation** - class-validator for input validation
- ✅ **Logging** - Winston logger with file and console output
- ✅ **Error Handling** - Centralized error management
- ✅ **TypeScript** - Full type safety

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger (swagger-ui-express)
- **Security**: Helmet, bcrypt, CORS
- **Logging**: Winston

## 📦 Installation

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- npm >= 9.0.0

### Steps

Perfect ✅ — you’ve provided a **complete project setup guide**, so here’s a polished, professional `README.md` version formatted for GitHub (with Markdown structure, emojis, headings, and code blocks).

---

````markdown
# 🧑‍💻 User Management Backend (Node.js + PostgreSQL + RBAC)

A **modular, reusable Node.js backend** for complete **user management** with **role-based access control (RBAC)**, **JWT authentication**, and **TypeORM integration** — built for scalability and reusability across projects.

---

## 🚀 Complete Guide to Run Your Project

This guide walks you through every step — from verifying installations to testing all endpoints.

---

## 📝 Step 1: Verify Installation

```bash
# Check Node.js version
node -v   # Should show v18.x.x or higher

# Check npm version
npm -v    # Should show 9.x.x or higher

# Check PostgreSQL
psql --version   # Should show PostgreSQL version

# Navigate to project directory
cd user-management-backend

# Verify all files exist
ls -la src/
````

---

## 🗄️ Step 2: Setup PostgreSQL Database

### Start PostgreSQL Service

**Windows**

```bash
# PostgreSQL should auto-start, or use Services app
```

**Mac**

```bash
brew services start postgresql@14
# OR
pg_ctl -D /usr/local/var/postgres start
```

**Linux**

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database and User

```bash
psql -U postgres

CREATE DATABASE user_management;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE user_management TO myuser;
\l
\q
```

---

## ⚙️ Step 3: Configure Environment Variables

Create or update your `.env` file:

```env
NODE_ENV=development
PORT=5000
API_PREFIX=/api/v1

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password
DB_DATABASE=user_management
DB_SYNCHRONIZE=true
DB_LOGGING=true

JWT_ACCESS_SECRET=my_super_secret_access_key_12345678901234567890
JWT_REFRESH_SECRET=my_super_secret_refresh_key_09876543210987654321
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

CORS_ORIGIN=http://localhost:3000

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

CLIENT_ID=test_client_id
CLIENT_SECRET=test_client_secret_123456
```

---

## 📦 Step 4: Install Dependencies

```bash
npm install
# If errors occur:
npm install --legacy-peer-deps
```

---

## 🔧 Step 5: Initial Database Sync

```bash
npm run dev
```

**Expected Output**

```
✅ Database connection established successfully
🚀 Server running on port 5000
📚 Swagger Documentation: http://localhost:5000/api-docs
🌍 Environment: development
```

---

## 📊 Step 6: Verify Database Tables

```bash
psql -U postgres -d user_management
\dt
# You should see tables like users, roles, permissions, user_roles, etc.
\q
```

---

## 🎯 Step 7: Create Migration Files (Optional)

Update `package.json`:

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm migration:generate -- -d ormconfig.ts",
    "migration:create": "npm run typeorm migration:create",
    "migration:run": "npm run typeorm migration:run -- -d ormconfig.ts",
    "migration:revert": "npm run typeorm migration:revert -- -d ormconfig.ts"
  }
}
```

Create migration directory:

```bash
mkdir -p src/migrations
npm run typeorm -- migration:generate src/migrations/InitialMigration -d ormconfig.ts
npm run migration:run
```

---

## 🚀 Step 8: Start the Application

```bash
npm run dev
```

---

## 🧪 Step 9: Test the API

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

### Test 2: API Root

```bash
curl http://localhost:5000/api/v1/
```

### Test 3: Register a New User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePass123!"}'
```

### Test 4: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'
```

### Test 5: Protected Route

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎨 Step 10: Use Swagger UI

Open:
👉 [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Authorize using the **accessToken** from login to access protected routes.

---

## 🛠️ Step 11: Create Initial Roles and Permissions

```sql
INSERT INTO permissions (id, name, description, "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'users.create', 'Create users', NOW(), NOW()),
(gen_random_uuid(), 'users.read', 'Read users', NOW(), NOW());

INSERT INTO roles (id, name, description, "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'admin', 'Administrator with full access', NOW(), NOW()),
(gen_random_uuid(), 'user', 'Regular user', NOW(), NOW());
```

---

## 🧪 Step 12–13: Test CRUD & RBAC

```bash
# Create Role
curl -X POST http://localhost:5000/api/v1/roles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"manager","description":"Manager role"}'

# Assign Role to User
curl -X POST http://localhost:5000/api/v1/roles/assign \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"YOUR_USER_ID","roleId":"ROLE_ID"}'
```

---

## 📱 Step 14: Test with Postman

* Import from Swagger: `http://localhost:5000/api-docs`
* Add environment variables:

  * `baseUrl` = [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
  * `token` = your access token

---

## 📊 Step 15: View Database Data

```sql
SELECT id, "firstName", "lastName", email FROM users;
SELECT u.email, r.name FROM users u
JOIN user_roles ur ON u.id = ur."userId"
JOIN roles r ON ur."roleId" = r.id;
```

---

## 🔒 Step 16–17: Token Refresh & Logout

```bash
# Refresh Token
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# Logout
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## ⚡ Quick Test Script

Create `test-api.sh`:

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🐛 Common Issues & Fixes

| Issue                     | Solution                             |
| ------------------------- | ------------------------------------ |
| **Connection refused**    | Ensure PostgreSQL service is running |
| **Authentication failed** | Verify DB credentials in `.env`      |
| **Port 5000 in use**      | Change `PORT` to 5001                |
| **TypeScript errors**     | `npm run lint:fix`                   |
| **Missing deps**          | `rm -rf node_modules && npm install` |

---

## ✅ Success Checklist

✅ PostgreSQL running
✅ `.env` configured correctly
✅ Database created
✅ `npm install` completed
✅ Server runs successfully
✅ Swagger docs accessible
✅ User registration & login working
✅ Protected routes functional

---

## 💡 Tech Stack

* **Node.js (v18+)**
* **Express.js**
* **PostgreSQL**
* **TypeORM**
* **JWT Authentication**
* **Swagger (OpenAPI)**
* **RBAC System (Roles & Permissions)**

---

## 🧰 Author

**Developed by:** Tech Minded
**GitHub:** [@TechMinded](#)
**License:** MIT

---

```

---

Would you like me to:
- add a **“Project Architecture”** section with folder structure and explanation (like `src/modules/auth`, `src/entities`, `src/config`),  
or  
- keep it as this clean operational guide?
```

