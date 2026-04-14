const Job = require('../models/Job');
const Task = require('../models/Task');

exports.getStats = async (req, res) => {
  try {
    console.log('📊 Fetching stats for user:', req.user.id);
    
    const userId = req.user.id;
    
    const totalJobs = await Job.countDocuments();
    const myApplications = await Job.countDocuments({ applicants: userId });
    
    const tasksPending = await Task.countDocuments({ user: userId, status: 'pending' });
    const tasksInProgress = await Task.countDocuments({ user: userId, status: 'in-progress' });
    const tasksCompleted = await Task.countDocuments({ user: userId, status: 'completed' });

    console.log(`✅ Stats: Jobs=${totalJobs}, Apps=${myApplications}, Todo=${tasksPending}, InProgress=${tasksInProgress}, Done=${tasksCompleted}`);

    res.status(200).json({
      success: true,
      totalJobs,
      myApplications,
      tasks: { 
        todo: tasksPending,
        inProgress: tasksInProgress,
        done: tasksCompleted
      }
    });
    
  } catch (err) {
    console.error('❌ Dashboard Stats Error:', err.message);
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};