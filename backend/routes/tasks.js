const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

// Get all tasks for logged-in user
router.get('/', auth, getTasks);

// Create new task
router.post('/', auth, createTask);

// Update task
router.put('/:id', auth, updateTask);

// Delete task
router.delete('/:id', auth, deleteTask);

module.exports = router;