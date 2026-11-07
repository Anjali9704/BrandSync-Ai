# BrandSync AI — Backend Engine

> **Enterprise AI Brand Governance API**
> Built with Node.js, Express.js, and MongoDB for **Team NOVASTACK** at the **Codenexus India Hackathon**.

---

## 🏗 Architecture & Stack

- **Runtime**: Node.js (v18+)
- **Web Framework**: Express.js (v4.21+)
- **Database**: MongoDB with Mongoose (v8.9+)
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Validation**: Joi schema validation middleware
- **CORS Handling**: Strict CORS middleware allowing credentials and origin negotiation
- **Embedded Database Fallback**: Integrated `mongodb-memory-server` ensuring 100% test reliability if local MongoDB service is stopped.

---

## 📁 Backend Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection & memory-server fallback
│   │   └── environment.js            # Environment variable configuration
│   ├── constants/
│   │   └── index.js                  # Roles, severities, issue types & sections
│   ├── controllers/
│   │   ├── analysis.controller.js    # AI content analysis & issue state endpoints
│   │   ├── auth.controller.js        # Registration, login, password recovery & user profile
│   │   ├── content.controller.js     # Content submissions CRUD
│   │   ├── dashboard.controller.js   # Metric aggregations & activity feed
│   │   ├── guideline.controller.js   # Guidelines & digital collateral asset controller
│   │   ├── report.controller.js      # Violations analytics & compliance trends
│   │   ├── review.controller.js      # Human sign-off queue & feedback history
│   │   └── team.controller.js        # Organization user administration
│   ├── middlewares/
│   │   ├── auth.middleware.js        # JWT verification & role authorization (RBAC)
│   │   ├── error.middleware.js       # Centralized error handler with { detail } support
│   │   └── validation.middleware.js  # Joi schema validation handler
│   ├── models/
│   │   ├── activity.model.js         # Audit log activities schema
│   │   ├── analysis.model.js         # AI compliance score & issue reports schema
│   │   ├── asset.model.js            # Brand logos, color swatches & typography schema
│   │   ├── content.model.js          # Submissions & draft texts schema
│   │   ├── guideline.model.js        # Corporate standards & rules schema
│   │   ├── review.model.js           # Reviewer sign-offs & revision notes schema
│   │   └── user.model.js             # User accounts & encrypted passwords schema
│   ├── routes/
│   │   ├── analysis.routes.js        # Analysis sub-routes
│   │   ├── auth.routes.js            # Authentication routes
│   │   ├── content.routes.js         # Content repository routes
│   │   ├── dashboard.routes.js       # Dashboard metric routes
│   │   ├── guideline.routes.js       # Guidelines & assets routes
│   │   ├── index.js                  # Central versioned router (/api/v1)
│   │   ├── report.routes.js          # Analytics routes
│   │   ├── review.routes.js          # Review queue routes
│   │   └── team.routes.js            # Member management routes
│   ├── scripts/
│   │   ├── seed.js                   # Standalone CLI seeder execution
│   │   └── seedRunner.js             # Seed database logic (5 users, 9 guidelines, demo drafts)
│   ├── services/
│   │   ├── analysis.service.js       # Brand governance rule-matching engine
│   │   ├── auth.service.js           # Authentication & token issuance
│   │   ├── content.service.js        # Submission storage & filtering
│   │   ├── dashboard.service.js      # KPI calculation & velocity tracking
│   │   ├── guideline.service.js      # Guidelines querying & persistence
│   │   ├── report.service.js         # Violation frequency aggregator
│   │   ├── review.service.js         # Decision pipeline & status transitions
│   │   └── team.service.js           # User provisioning & role management
│   ├── utils/
│   │   ├── ApiError.js               # Standard error class
│   │   ├── ApiResponse.js            # Unified JSON response wrapper
│   │   └── asyncHandler.js           # Async promise wrapper
│   ├── validators/
│   │   ├── auth.validator.js         # Login & register validation
│   │   ├── content.validator.js      # Content submission schemas
│   │   ├── guideline.validator.js    # Guideline rule schemas
│   │   ├── review.validator.js       # Review decision schemas
│   │   └── team.validator.js         # Member invite schemas
│   ├── app.js                        # Express application & CORS middleware setup
│   └── server.js                     # Server entrypoint & graceful shutdown
├── tests/
│   └── api.test.js                   # Automated integration test suite
├── .env.example
├── .env
├── .gitignore
└── package.json
```

---

## ⚡ Installation & Execution

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment (`.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/brandsync_ai
JWT_SECRET=brandsync_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database
```bash
npm run seed
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Start Backend Server
```bash
npm start
# or development mode with live watch:
npm run dev
```

Server will be running at `http://localhost:5000/api/v1` with healthcheck at `/api/v1/health`.

---

## 🔒 CORS Configuration Summary

- **Allowed Origins**: `http://localhost:5173`, `http://localhost:3000`, and `process.env.FRONTEND_URL`
- **Methods Supported**: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- **Headers Supported**: `Content-Type, Authorization, X-Requested-With, Accept`
- **Credentials**: `credentials: true` enabled
- **Preflight**: Express automatic OPTIONS resolution handled prior to route dispatch.

---

## 📋 Complete REST API Contract

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/health` | GET | Public | Healthcheck and service uptime |
| `/api/v1/auth/login` | POST | Public | User login returning JWT & profile |
| `/api/v1/auth/register` | POST | Public | Account registration |
| `/api/v1/auth/forgot-password` | POST | Public | Dispatches password reset link |
| `/api/v1/auth/me` | GET | Authenticated | Fetches current user profile |
| `/api/v1/dashboard/stats` | GET | Authenticated | Aggregated KPIs, charts & recent activities |
| `/api/v1/content` | POST | Authenticated | Create a content submission |
| `/api/v1/content` | GET | Authenticated | Filter & paginate content library |
| `/api/v1/content/:id` | GET | Authenticated | Fetch specific content item |
| `/api/v1/content/:id/analyze`| POST | Authenticated | Trigger AI brand governance analysis |
| `/api/v1/content/:id/issues/:issue_id` | PATCH | Authenticated | Update issue status (accepted/rejected) |
| `/api/v1/guidelines` | GET | Authenticated | Retrieve guidelines by section/search |
| `/api/v1/guidelines` | POST | Admin, Brand Mgr | Create a new brand standard |
| `/api/v1/guidelines/:id` | PUT | Admin, Brand Mgr | Update guideline rule |
| `/api/v1/guidelines/:id` | DELETE | Admin, Brand Mgr | Delete guideline rule |
| `/api/v1/guidelines/assets`| GET | Authenticated | Retrieve brand collateral assets |
| `/api/v1/guidelines/assets`| POST | Authenticated | Upload collateral file |
| `/api/v1/guidelines/assets/:id` | DELETE | Authenticated | Delete asset |
| `/api/v1/review` | GET | Admin, Brand Mgr, Reviewer | Fetch review authorization queue |
| `/api/v1/review/:content_id` | POST | Admin, Brand Mgr, Reviewer | Submit approval/rejection decision |
| `/api/v1/review/:content_id/history` | GET | Authenticated | Retrieve review log timeline |
| `/api/v1/reports/summary` | GET | Admin, Brand Mgr | Aggregated violations & category trends |
| `/api/v1/team` | GET | Admin | Retrieve organization team members |
| `/api/v1/team` | POST | Admin | Invite new collaborator |
| `/api/v1/team/:id` | PUT | Admin | Update member role/status |
| `/api/v1/team/:id` | DELETE | Admin | Revoke member access |

