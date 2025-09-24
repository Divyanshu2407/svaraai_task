const taskRepository = require('../repositories/taskRepository');
const taskService = require('../services/taskService');

// Update task (status, priority, etc.)
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body; // e.g., { status: 'in-progress', priority: 'high' }
    const updatedTask = await taskRepository.updateTask(taskId, updates);
    res.json({ success: true, task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get tasks for a project, with optional filtering/pagination
const getTasks = async (req, res) => {
  const { projectId } = req.params;
  const { page, limit, status, priority, deadlineFrom, deadlineTo } = req.query;

  try {
    const result = await taskService.getTasksByProject(projectId, { page, limit, status, priority, deadlineFrom, deadlineTo });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new task under a project
const postTask = async (req, res) => {
  const { projectId } = req.params;
  const payload = { ...req.body, projectId };

  try {
    const task = await taskService.createTask(payload);
    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params; // include projectId for clarity
    await taskRepository.deleteTask(taskId);
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getTasks,
  postTask,
  updateTask,
  deleteTask,
};
