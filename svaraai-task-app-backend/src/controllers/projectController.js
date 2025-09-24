const Project = require('../models/Project');

const createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Project name is required' });
  }
  const project = await Project.create({ name, description });
  res.status(201).json(project);
};

const listProjects = async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const deleted = await Project.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json({ message: 'Project deleted' });
};

module.exports = {
  createProject,
  listProjects,
  deleteProject,
};
