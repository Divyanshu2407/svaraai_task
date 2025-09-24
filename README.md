Project Management Dashboard
A full-stack project management application with a Kanban board, task prioritization, and real-time status updates. Built with Next.js, React, TypeScript, Node.js, Express, and MongoDB.

Table of Contents
Features
Tech Stack
Setup
Project Architecture
API Endpoints
Features
Create, update, delete projects.
Create, update, delete tasks with status, priority, and deadlines.
Kanban board with drag-and-drop for task management.
Search and filter tasks by title, status, and priority.
Dashboard with stats: total projects, total tasks, overdue tasks.
Pie chart visualization for tasks by status.
Responsive UI with TailwindCSS.
Tech Stack
Frontend: Next.js, React, TypeScript, TailwindCSS, Recharts
Backend: Node.js, Express, MongoDB, Mongoose
Authentication: JWT
Drag & Drop: DnD Kit
HTTP Client: Axios
Setup
Backend
Go to the backend folder:

cd backend
Install dependencies: npm install

Create a .env file with the following variables: PORT=4000 MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_secret_key

Start the backend server: npm run dev

Project Architecture
This is a full-stack MERN-style architecture with a separation of concerns:

Frontend (Next.js + React + TypeScript)
Pages: dashboard, project/[projectId] for Kanban.

Components: Reusable UI elements like Card, Modal.

State management: React useState and useEffect for fetching and updating tasks/projects.

Drag-and-drop: DnD Kit for Kanban board.

API calls: Axios to communicate with backend.

Backend (Node.js + Express)
Routes

authRoutes.js – Signup/Login

projectRoutes.js – CRUD for projects

taskRoutes.js – CRUD for tasks under a project

Controllers

Handle business logic for tasks, projects, authentication.

Services/Repositories

Encapsulate database operations for tasks/projects.

Middleware

JWT authentication middleware to protect routes.

Database (MongoDB + Mongoose)

Collections: users, projects, tasks

Relations:

A Project has many Tasks.

A Task belongs to one Project.

API Endpoints
Auth
POST /api/auth/signup – Register user
POST /api/auth/login – Login user
Projects
POST /api/projects – Create project
GET /api/projects – List projects
DELETE /api/projects/:id – Delete project
Tasks
GET /api/projects/:projectId/tasks – List tasks for a project
POST /api/projects/:projectId/tasks – Create task
PATCH /api/projects/:projectId/tasks/:taskId – Update task
DELETE /api/projects/:projectId/tasks/:taskId – Delete task
