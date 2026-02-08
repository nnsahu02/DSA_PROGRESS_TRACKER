# DSA Progress Tracker

A comprehensive backend API for tracking Data Structures & Algorithms (DSA) learning progress. This application helps students organize their DSA learning journey by tracking problems, topics, and completion status.

## Overview

DSA Progress Tracker is a Node.js/Express API built with TypeScript that enables students to:
- **Organize Learning**: Structure DSA problems by topics
- **Track Progress**: Mark problems as completed and monitor learning journey
- **Centralize Resources**: Store and access tutorial videos, practice links, and articles for each problem
- **Manage Difficulty Levels**: Problems are categorized by difficulty (easy, medium, hard)
- **Secure Access**: User authentication with JWT tokens and role-based access control

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) + bcryptjs
- **Security**: CORS, Cookie Parser
- **Logging**: Morgan
- **Development**: Nodemon, ts-node

## Project Structure

```
src/
├── config/              # Configuration files
│   ├── dbConnection.ts  # MongoDB connection setup
│   └── env.ts           # Environment variables
├── modules/             # Feature modules
│   ├── auth/            # Authentication (login, signup, refresh token)
│   ├── user/            # User profile management
│   ├── topic/           # DSA topics (Arrays, Linked Lists, etc.)
│   ├── problem/         # DSA problems and their resources
│   ├── progress/        # Problem completion tracking
│   └── refreshToken/    # Token refresh mechanism
├── middlewares/         # Express middlewares
│   └── auth.middleware.ts # JWT authentication middleware
├── utils/               # Utility functions
├── routes/              # API route definitions
├── seed/                # Database seed scripts
└── index.ts             # Application entry point
```

## API Features

### Authentication Module
- User registration and login
- JWT-based authentication
- Refresh token mechanism
- Secure password hashing with bcryptjs

### User Module
- Retrieve user profile with last working topic
- Update user profile information
- Role-based access (student, admin)

### Topic Module
- Create and retrieve DSA topics
- Topic ordering for structured learning path

### Problem Module
- Create problems under specific topics
- Categorize by difficulty level (easy, medium, hard)
- Store multiple learning resources:
  - YouTube tutorial links
  - Practice problem links
  - Article/documentation links

### Progress Module
- Track problem completion status
- Record completion timestamps
- Maintain unique progress per user-problem pair
- View overall learning progress

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nnsahu02/DSA_PROGRESS_TRACKER.git
   cd DSA_PROGRESS_TRACKER
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dsa-tracker
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   REFRESH_TOKEN_EXPIRES_DAYS=30
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` with hot-reload enabled via Nodemon.

## Database Seeding

The application automatically seeds the database with initial DSA topics and problems on startup. Check the `src/seed/` directory for seed data configuration.

## CORS Configuration

By default, CORS is configured to allow requests from:
- `http://localhost:5173` (Frontend development server)

To add additional origins, update the `allowedOrigins` array in `src/index.ts`.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh JWT token
- `POST /auth/logout` - User logout

### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update user profile

### Topics
- `GET /topic` - Get all topics

### Problems
- `GET /problems/v2/topic/:topicId` - Get problems by topic

### Progress
- `GET /progress/dashboard` - Get user's progress
- `POST /progress/complete` - Mark problem as completed
- `POST /progress/uncompletecomplete` - Mark problem as uncompleted
- `POST /progress/restore` - To Restore all progress

## Authentication

All protected endpoints require a JWT token in the Cookies:
```

```