# CodebaseOS Setup Guide

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| npm | 9+ |
| MongoDB | 6+ (or Atlas account) |
| Git | 2+ |
| Google Gemini API key | Get from [AI Studio](https://aistudio.google.com/apikey) |
| GitLab account | Optional (falls back to local storage) |

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/muhammad-harisk23/CodebaseOS.git
cd CodebaseOS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/codebaseos

# Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# GitLab (optional)
GITLAB_TOKEN=your_gitlab_token
GITLAB_PROJECT_ID=your_project_id
GITLAB_BASE_URL=https://gitlab.com/api/v4
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 4. Verify Installation

```bash
# Health check
curl http://localhost:5000/api/health
# Expected: { "success": true, "message": "CodebaseOS API is running", ... }
```

---

## MongoDB Setup

### Option 1: Local MongoDB

```bash
# Start MongoDB
mongod --dbpath /data/db
```

### Option 2: MongoDB Atlas (Free Tier)

1. Create an account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Set it as `MONGO_URI` in `.env`

---

## Gemini Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key to `GEMINI_API_KEY` in `.env`

---

## GitLab Setup (Optional)

CodebaseOS works without GitLab — all issues are stored locally. To enable real GitLab integration:

1. Go to your GitLab project → Settings → Access Tokens
2. Create a token with `api` scope
3. Note your Project ID (Settings → General → Project ID)
4. Add both to `.env`:

```env
GITLAB_TOKEN=glpat-your-token-here
GITLAB_PROJECT_ID=12345678
GITLAB_BASE_URL=https://gitlab.com/api/v4
```

When GitLab is configured, issues appear in your real GitLab project. When it's not configured, issues are stored in MongoDB and accessible via the API.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/codebaseos` | MongoDB connection string |
| `GEMINI_API_KEY` | Yes | `""` | Google Gemini API key |
| `GITLAB_TOKEN` | No | `""` | GitLab personal access token |
| `GITLAB_PROJECT_ID` | No | `""` | GitLab project ID |
| `GITLAB_BASE_URL` | No | `https://gitlab.com/api/v4` | GitLab API base URL |
| `TEMP_REPO_DIR` | No | `./tmp/repos` | Temporary clone directory |
| `UPLOAD_DIR` | No | `./uploads` | ZIP upload directory |

---

## Project Structure

```
CodebaseOS/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # API handlers
│   │   ├── middleware/    # Error handling
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   ├── docs/             # Technical docs
│   └── uploads/          # ZIP storage
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── api/          # API client
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   ├── services/     # Frontend services
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
├── screenshots/          # Demo screenshots
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── FEATURES.md
└── LICENSE
```

---

## Running Tests

```bash
# TypeScript compilation check
cd backend && npx tsc --noEmit

# Backend (when tests are added)
cd backend && npm test
```

---

## Troubleshooting

### MongoDB Connection Error

```bash
# Ensure MongoDB is running
mongod --dbpath /data/db
```

### Gemini API Key Error

```bash
# Verify GEMINI_API_KEY is set in .env
# The agent still works without it, but AI recommendations will be unavailable
```

### GitLab Not Working

CodebaseOS falls back to local storage automatically. All issues are still created and accessible via the API.

### Port Already in Use

```bash
# Change the port in .env
PORT=5001
```

---

## API Documentation

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full API reference.

Base URL: `http://localhost:5000/api/v1`

### Quick Test

```bash
# Health check
curl http://localhost:5000/api/health

# List repositories
curl http://localhost:5000/api/v1/repositories