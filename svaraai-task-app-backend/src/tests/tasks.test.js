const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('../routes/taskRoutes');
const Project = require('../models/Project');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Mock Express app
const app = express();
app.use(express.json());
app.use('/api/projects/:projectId/tasks', taskRoutes);

// Generate a test JWT
const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ id: testUserId }, 'your_jwt_secret', { expiresIn: '1h' });

let projectId;
let taskId;

// Connect to in-memory MongoDB for tests
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const project = await Project.create({ name: 'Test Project', userId: testUserId });
  projectId = project._id.toString();
});

// Cleanup after tests
afterAll(async () => {
  await Project.deleteMany({});
  await Task.deleteMany({});
  await mongoose.connection.close();
});

describe('Tasks API', () => {
  test('POST /tasks - create task', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', status: 'todo', priority: 'low', deadline: new Date() });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.task.title).toBe('Test Task');

    taskId = res.body.task._id;
  });

  test('GET /tasks - get tasks', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.tasks.length).toBeGreaterThanOrEqual(1);
  });

  test('PATCH /tasks/:taskId - update task', async () => {
    const res = await request(app)
      .patch(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in-progress' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.task.status).toBe('in-progress');
  });

  test('DELETE /tasks/:taskId - delete task', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
