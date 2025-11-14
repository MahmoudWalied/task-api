## Task API

A secure task management REST API built with Express, Sequelize, and MySQL. It supports user authentication and per-user task CRUD operations with status tracking and validation.

### Features
- JWT-based authentication with register/login/logout endpoints
- Task CRUD with status filtering and per-user access control
- Sequelize ORM models, repositories, and services for clean separation
- Centralized error handling and validation via `express-validator`
- Postman collection for quick testing (`postman/task-api.postman_collection.json`)

### Getting Started
1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` (if available) and set DB credentials, JWT secret, etc.
3. Run the dev server:
   ```
   npm run dev
   ```
4. API available at `http://localhost:3000/api` by default.

### Scripts
- `npm start` – run in production mode.
- `npm run dev` – run with Nodemon for hot reload.

### Tech Stack
- Node.js + Express 5
- Sequelize ORM (MySQL)
- JWT + bcryptjs
- express-validator

### Testing the API
Use the included Postman collection or any HTTP client. Authenticate via `/api/auth/login`, then include the returned Bearer token in `Authorization` headers for `/api/tasks` endpoints.

