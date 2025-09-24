import axios from 'axios';
import { Task } from '@/types/task';

// Get all tasks of a project
export const getTasks = (token: string, projectId: string) => {
  return axios.get<{ data: Task[] }>(
    `http://localhost:4000/api/projects/${projectId}/tasks`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Update a task (status, title, priority, etc.)
export const updateTask = (token: string, projectId: string, taskId: string, data: Partial<Task>) => {
  return axios.patch(
    `http://localhost:4000/api/projects/${projectId}/tasks/${taskId}`, // ✅ backend route
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Create a new task
export const createTask = (token: string, projectId: string, taskData: Partial<Task>) => {
  return axios.post(
    `http://localhost:4000/api/projects/${projectId}/tasks`,
    taskData,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

// Delete a task
// Delete a task
export const deleteTask = (token: string, projectId: string, taskId: string) => {
  return axios.delete<{ success: boolean; message?: string }>(
    `http://localhost:4000/api/projects/${projectId}/tasks/${taskId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
