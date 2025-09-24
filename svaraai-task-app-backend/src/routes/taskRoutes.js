const express = require('express');
const router = express.Router({ mergeParams: true }); // merge projectId
const taskController = require('../controllers/taskController');

router.get('/', taskController.getTasks);
router.post('/', taskController.postTask);
router.patch('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask); 

module.exports = router;
