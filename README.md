# 🗂️ Team Task Manager

A full-stack **Team Task Management Application** that allows teams to manage projects, assign tasks, track progress, and collaborate efficiently.

---

## 🚀 Features

### 👤 Authentication

* User Signup & Login
* Role-based access (Admin & User)

### 📊 Dashboard

* Overview of:

  * Total Projects
  * Tasks (To Do, In Progress, Completed)
* Recent tasks listing

### 📁 Projects Management

* Create, update projects (Admin only)
* Assign members to projects
* View project details

### ✅ Tasks Management

* Create, update, and manage tasks
* Assign tasks to users
* Track task status:

  * To Do
  * In Progress
  * Done
* Due date validation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Context API (State Management)
* Lucide Icons

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

---

## 📂 Project Structure

```
/frontend
  ├── pages
  │   ├── Dashboard.jsx
  │   ├── Projects.jsx
  │   ├── Tasks.jsx
  │   ├── Login.jsx
  │   └── Signup.jsx
  ├── components
  ├── context
  ├── api

/backend
  ├── routes
  │   ├── auth.js
  │   ├── projects.js
  │   ├── tasks.js
  │   └── users.js
  ├── config
  ├── server.js
```

---

### 2️⃣ Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🌐 API Endpoints

### Auth

* `POST /api/auth/login`
* `POST /api/auth/signup`

### Projects

* `GET /api/projects`
* `POST /api/projects`
* `PUT /api/projects/:id`

### Tasks

* `GET /api/tasks`
* `POST /api/tasks`
* `PUT /api/tasks/:id`

### Users

* `GET /api/users`

---

## 📸 Screens

* Dashboard Overview
* Project Management
* Task Management

---

## 📌 Future Improvements

* Notifications system
* File attachments in tasks
* Comments on tasks
* Real-time updates (Socket.io)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Karan Bansal**

---

⭐ If you like this project, don't forget to give it a star!
