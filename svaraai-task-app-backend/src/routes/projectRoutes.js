const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/authMiddleware');
const taskRoutes = require('./taskRoutes');

router.use(auth);
router.post('/', projectController.createProject);
router.get('/', projectController.listProjects);
router.delete('/:id', projectController.deleteProject);
router.use('/:projectId/tasks', taskRoutes);

module.exports = router;
