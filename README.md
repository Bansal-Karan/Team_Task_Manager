# Team Task Manager

A full-stack application built with React, Node.js, Express, and MongoDB, ready for instant deployment.

## Features
- **Authentication**: JWT-based Signup/Login.
- **Roles**: Admin and Member access control.
- **Project Management**: Admins can create projects and assign team members.
- **Task Management**: Create tasks, assign to users, track statuses (To Do, In Progress, Done).
- **Dashboard**: High-level overview of projects and tasks with beautiful statistics.

## Local Development Setup

1. **Install Dependencies**
   Run the following from the root directory:
   ```bash
   npm run install
   ```

2. **Configure Environment Variables**
   In the `backend/` folder, ensure you have a `.env` file containing:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/teamtaskmanager
   JWT_SECRET=supersecret123
   ```
   *(Make sure you have MongoDB running locally, or replace `MONGO_URI` with a MongoDB Atlas cluster URI.)*

3. **Run the App**
   Open two terminal tabs:
   - **Backend**: `cd backend && npm run dev`
   - **Frontend**: `cd frontend && npm run dev`

---

## 🚀 Mandatory Deployment Instructions (Railway)

To fulfill the deployment requirement and ensure the app is live and fully functional, follow these steps:

### Option 1: Quick Deployment using Railway GitHub Integration (Recommended)
1. Push this entire project to a new repository on your **GitHub**.
2. Go to [Railway.app](https://railway.app/) and log in.
3. Click **"New Project"** -> **"Deploy from GitHub repo"** and select your repository.
4. Add a **MongoDB Service**:
   - In your Railway project, click **"New"** -> **"Database"** -> **"Add MongoDB"**.
5. Configure Environment Variables:
   - Click on your application service (not the DB).
   - Go to the **Variables** tab.
   - Click **"New Variable"**.
   - Add `MONGO_URI` and set its value to your MongoDB connection string (Railway will auto-generate one from the MongoDB service, typically `mongodb://mongo:mongo@containers-us-west-...`).
   - Add `JWT_SECRET` and set it to a secure random string (e.g., `mysecretkey123`).
6. Railway will automatically detect the `package.json` in the root, install dependencies, build the frontend (`npm run build`), and start the backend server serving the static frontend files!
7. Once deployed, click on your app service -> **Settings** -> **Generate Domain**. You now have a live URL!

That's it! Your app is now live and fully functional.

### Build Details
- The frontend is built using Vite and outputted to `frontend/dist`.
- The Node.js backend (`backend/server.js`) handles all `/api/*` routes.
- Any request not matching `/api/*` is routed to the compiled frontend `index.html`, making it a single-service full-stack deployment.
