# SvaraAI Task Manager – Project Management Dashboard

A full-stack **Project Management Dashboard** with Kanban board, task prioritization, search, filters, and status visualization. Built using **Next.js**, **React**, **Node.js**, **Express** and **MongoDB**.


## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
  - [Backend](#backend-setup)
  - [Frontend](#frontend-setup)
- [Testing ( Backend )](#Testing(Backend))
- [Project Architecture](#project-architecture)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)


## Features
- Create, update, delete projects.
- Create, update, delete tasks with status, priority, and deadlines.
- Kanban board with drag-and-drop for task management.
- Dashboard with total projects, total tasks, and overdue tasks.
- Pie chart visualization of tasks by status.
- Search and filter tasks by title, status, and priority.
- Responsive UI built with TailwindCSS.


## Tech Stack
- **Frontend:** Next.js, React, TypeScript, TailwindCSS, Recharts, DnD Kit
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT
- **HTTP Client:** Axios


## Setup


### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd svaraai-task-app-backend

2. Install dependencies:
   npm install

3. Create a .env file with the following variables:
   PORT=4000 MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_secret_key

4. Start the backend server:
   npm run dev


### Frontend Setup
1. Navigate to the backend folder:
   ```bash
   cd svaraai-task-app-frontend
2. Install dependencies:
   npm install

3. Start the frontend server:
   npm run dev


## Testing ( Backend )
1.  We use Jest for backend unit tests.
    ```bash
    cd svaraai-task-app-backend
    npm install --save-dev jest supertest
    npm run test
    
2. Tests are located in /tests folder (e.g., tasks.test.js).
3. Covers creating, updating, fetching, and deleting tasks via API endpoints.
4. Ensures API routes respond correctly and database updates as expected.


###Project Architecture

# Backend

- Express server handling API requests
- Mongoose models for Projects and Tasks
- Controllers handle API logic (taskController.js, projectController.js)
- Services encapsulate database operations (taskService.js, projectService.js)
- Repositories handle direct database queries (taskRepository.js, projectRepository.js)
- Routes define API endpoints and connect to controllers
- Middleware for authentication and error handling

# Frontend

- Next.js App Router (app/) for pages and layouts
- Context API for authentication state (AuthContext)
- Services for API requests (projectService.ts, taskService.ts)
- Components for reusable UI: Card, Modal, Kanban columns
- DnD Kit for drag-and-drop functionality
- Recharts for pie charts visualization





### API Endpoints

# Projects
Method	          Endpoint	                                   Description
GET	          /api/projects	                                 Get all projects
POST	        /api/projects	                                 Create a project
PATCH	        /api/projects/:projectId  	                   Update project
DELETE	      /api/projects/:projectId	                     Delete project

# Tasks
Method	         Endpoint	                                   Description
GET	         /api/projects/:projectId/tasks	               Get all tasks for a project
POST	       /api/projects/:projectId/tasks	               Create a new task
PATCH     	 /api/projects/:projectId/tasks/:taskId	       Update task (status, priority, etc.)
DELETE    	 /api/projects/:projectId/tasks/:taskId	       Delete


### Usage

1. Sign up and log in (JWT authentication).
2. Create a project and start adding tasks.
3. Drag and drop tasks between columns to update status.
4. Update task priority or delete tasks using the dashboard controls.
5. Dashboard shows total tasks, projects, overdue tasks, and a pie chart by status.


### Notes

1. Ensure MongoDB is running locally or use a cloud database.
2. Backend must run on port 4000 and frontend on 3000.
3. All API requests require JWT token for authentication.
4. Tests can be run independently of frontend to validate backend logic.


### Quick Video Demo (Link - https://drive.google.com/file/d/12804IhEp9H4T1bI9DbwJATPRWDHbrx4Y/view?usp=drive_link )

- Sign up / login.
- Create a project.
- Add tasks with status, priority, and deadline.
- Drag & drop tasks to change status.
- Use priority dropdown to update priority.
- Click delete to remove tasks (confirmation appears).
- Dashboard shows:
- Total projects
- Total tasks
- Overdue tasks
- Pie chart of tasks by status
