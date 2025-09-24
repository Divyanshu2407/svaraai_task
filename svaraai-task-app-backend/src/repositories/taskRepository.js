const Task = require('../models/Task');

const createTask = (data) => Task.create(data);

const updateTask = (id, update) => Task.findByIdAndUpdate(id, { ...update, updatedAt: new Date() }, { new: true });

const deleteTask = (id) => Task.findByIdAndDelete(id);

const findByQuery = async (query, { skip=0, limit=10, sort={} } = {}) => {
  const [docs, total] = await Promise.all([
    Task.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Task.countDocuments(query)
  ]);
  return { docs, total };
};

module.exports = { createTask, updateTask, deleteTask, findByQuery };
