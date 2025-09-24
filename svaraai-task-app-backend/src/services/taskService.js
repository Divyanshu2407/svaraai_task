const taskRepository = require('../repositories/taskRepository');

const buildQuery = ({ projectId, status, priority, deadlineFrom, deadlineTo }) => {
  const q = { projectId };
  if (status) q.status = status;
  if (priority) q.priority = priority;
  if (deadlineFrom || deadlineTo) {
    q.deadline = {};
    if (deadlineFrom) q.deadline.$gte = new Date(deadlineFrom);
    if (deadlineTo) q.deadline.$lte = new Date(deadlineTo);
  }
  return q;
};

const getTasksByProject = async (projectId, { page = 1, limit = 10, status, priority, deadlineFrom, deadlineTo }) => {
  const query = buildQuery({ projectId, status, priority, deadlineFrom, deadlineTo });
  const skip = (page - 1) * limit;
  const { docs, total } = await taskRepository.findByQuery(query, { skip, limit });
  return {
    tasks: docs,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

const createTask = async (taskData) => {
  if (!taskData.title || !taskData.projectId) throw new Error('title & projectId required');
  return taskRepository.createTask(taskData);
};

const updateTaskStatus = async (taskId, status) => {
  if (!taskId || !status) throw new Error('taskId and status are required');
  return taskRepository.updateTask(taskId, { status });
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask: taskRepository.updateTask,
  deleteTask: taskRepository.deleteTask,
  updateTaskStatus,
};
