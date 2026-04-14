const Task = require('../models/Task');

// ========== CREATE TASK ==========
exports.createTask = async (req, res) => {
    try {
        console.log('📝 CREATE TASK - User ID:', req.user?.id);
        console.log('📝 CREATE TASK - Request Body:', req.body);

        const { title, description } = req.body;

        // ✅ Check authentication
        if (!req.user || !req.user.id) {
            console.log('❌ No user authenticated');
            return res.status(401).json({ message: "User not authenticated" });
        }

        // ✅ Validate required fields
        if (!title) {
            console.log('❌ Title is missing');
            return res.status(400).json({ message: "Title is required" });
        }

        if (!description) {
            console.log('❌ Description is missing');
            return res.status(400).json({ message: "Description is required" });
        }

        // ✅ Create new task
        const newTask = new Task({
            title: title.trim(),
            description: description.trim(),
            status: 'pending',
            user: req.user.id
        });

        console.log('💾 Saving task to MongoDB...');
        const savedTask = await newTask.save();
        console.log('✅ Task created successfully:', savedTask._id);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task: savedTask
        });

    } catch (err) {
        console.error('❌ CREATE TASK ERROR:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ 
            message: err.message,
            error: process.env.NODE_ENV === 'development' ? err : undefined
        });
    }
};

// ========== GET ALL TASKS ==========
exports.getTasks = async (req, res) => {
    try {
        console.log('🔍 GET TASKS - User ID:', req.user?.id);

        if (!req.user || !req.user.id) {
            console.log('❌ No user authenticated');
            return res.status(401).json({ message: "User not authenticated" });
        }

        const tasks = await Task.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${tasks.length} tasks for user ${req.user.id}`);

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (err) {
        console.error('❌ GET TASKS ERROR:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// ========== UPDATE TASK ==========
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        console.log('✏️ UPDATE TASK - Task ID:', id);
        console.log('✏️ UPDATE TASK - User ID:', req.user?.id);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this task" });
        }

        if (title) task.title = title.trim();
        if (description) task.description = description.trim();
        if (status) task.status = status;

        const updatedTask = await task.save();
        console.log('✅ Task updated successfully');

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task: updatedTask
        });

    } catch (err) {
        console.error('❌ UPDATE TASK ERROR:', err.message);
        res.status(500).json({ message: err.message });
    }
};

// ========== DELETE TASK ==========
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('🗑️ DELETE TASK - Task ID:', id);
        console.log('🗑️ DELETE TASK - User ID:', req.user?.id);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        await Task.findByIdAndDelete(id);
        console.log('✅ Task deleted successfully');

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (err) {
        console.error('❌ DELETE TASK ERROR:', err.message);
        res.status(500).json({ message: err.message });
    }
};