'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProjects } from '@/services/projectService';
import { getTasks, updateTask, deleteTask } from '@/services/taskService';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  todo: '#3b82f6',
  'in-progress': '#f59e0b',
  done: '#10b981',
};

export default function Dashboard() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Load projects & tasks
  const loadData = async () => {
    if (!token) return;
    try {
      const projRes = await getProjects(token);
      const projectsData = projRes.data || [];
      setProjects(projectsData);

      const allTasks: Task[] = [];
      for (const p of projectsData) {
        const taskRes = await getTasks(token, p._id);
        const tasksData: Task[] = taskRes?.data?.tasks || [];
        allTasks.push(...tasksData);
      }
      setTasks(allTasks);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading dashboard...</div>;

  // Filter tasks by search query
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute tasks by status for Pie chart
  const tasksByStatus = ['todo', 'in-progress', 'done'].map(status => ({
    name: status,
    value: filteredTasks.filter(t => t.status === status).length,
  }));

  // Overdue tasks
  const now = new Date();
  const overdueTasks = filteredTasks.filter(t => new Date(t.deadline) < now && t.status !== 'done');

  // Handle status/priority change
  const handleStatusChange = async (task: Task, newStatus: string, newPriority?: string) => {
    if (!token) return;
    try {
      const updates: Partial<Task> = { status: newStatus };
      if (newPriority) updates.priority = newPriority;
      await updateTask(token, task.projectId, task._id, updates);
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, ...updates } : t));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  // Open delete confirmation modal
  const confirmDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  // Handle actual deletion
  const handleDeleteTask = async () => {
    if (!token || !taskToDelete || !taskToDelete.projectId) return;
    try {
      await deleteTask(token, taskToDelete.projectId, taskToDelete._id);
      setTasks(prev => prev.filter(t => t._id !== taskToDelete._id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        className="border p-2 rounded mb-4 w-full"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Projects</h2>
          <p className="text-3xl font-bold mt-2">{projects.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Tasks</h2>
          <p className="text-3xl font-bold mt-2">{filteredTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Overdue Tasks</h2>
          <p className="text-3xl font-bold mt-2">{overdueTasks.length}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={tasksByStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {tasksByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['todo', 'in-progress', 'done'].map(status => (
          <div
            key={status}
            className="bg-white p-4 rounded shadow min-h-[200px]"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              const taskId = e.dataTransfer.getData('taskId');
              const task = tasks.find(t => t._id === taskId);
              if (task) handleStatusChange(task, status);
            }}
          >
            <h3 className="text-lg font-semibold capitalize mb-2">{status.replace('-', ' ')}</h3>
            <div className="flex flex-col gap-2">
              {filteredTasks
                .filter(t => t.status === status)
                .map(task => (
                  <div
                    key={task._id}
                    className="p-2 bg-blue-50 rounded flex justify-between items-start cursor-pointer hover:bg-blue-100 transition"
                    draggable
                    onDragStart={e => e.dataTransfer.setData('taskId', task._id)}
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {/* Priority Badge */}
                      <select
                        value={task.priority}
                        onChange={e => handleStatusChange(task, task.status, e.target.value)}
                        className={`px-2 py-0.5 rounded text-white text-xs ${
                          task.priority === 'high'
                            ? 'bg-red-500'
                            : task.priority === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>

                      {/* Delete Button */}
                      <button
                        className="text-red-500 text-sm hover:text-red-700"
                        onClick={() => confirmDeleteTask(task)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete "{taskToDelete?.title}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
