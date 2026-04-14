import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, LogOut, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    if (token) {
      fetchUserTasks();
    }
  }, [token]);

  const fetchUserTasks = async () => {
    try {
      console.log('📋 Fetching user tasks...');
      
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const taskList = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(taskList);

      // Calculate stats
      const pending = taskList.filter(t => t.status === 'pending').length;
      const inProgress = taskList.filter(t => t.status === 'in-progress').length;
      const completed = taskList.filter(t => t.status === 'completed').length;

      setStats({ pending, inProgress, completed });
      console.log('✅ Tasks loaded:', taskList.length);

    } catch (err) {
      console.error('❌ Error fetching tasks:', err.message);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* User Info Card */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
              <p className="text-indigo-100 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {user?.email || 'No email'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <p className="text-indigo-100 text-sm font-medium">Total Tasks</p>
            <h2 className="text-4xl font-bold mt-2">{tasks.length}</h2>
          </div>
          <div className="text-center">
            <p className="text-indigo-100 text-sm font-medium">Completed</p>
            <h2 className="text-4xl font-bold mt-2 text-green-300">{stats.completed}</h2>
          </div>
          <div className="text-center">
            <p className="text-indigo-100 text-sm font-medium">In Progress</p>
            <h2 className="text-4xl font-bold mt-2 text-yellow-300">{stats.inProgress}</h2>
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Tasks Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Pending</h3>
              <AlertCircle className="text-blue-600" size={24} />
            </div>
            <p className="text-4xl font-bold text-blue-600">{stats.pending}</p>
            <p className="text-sm text-gray-600 mt-2">Tasks waiting to start</p>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">In Progress</h3>
              <Clock className="text-yellow-600" size={24} />
            </div>
            <p className="text-4xl font-bold text-yellow-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600 mt-2">Tasks being worked on</p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Completed</h3>
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600 mt-2">Finished tasks</p>
          </div>
        </div>
      </div>

      {/* All Tasks List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">All Your Tasks</h2>

        {tasks.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500 text-lg">No tasks yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task._id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{task.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                        task.status === 'pending'
                          ? 'bg-blue-100 text-blue-800'
                          : task.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.status === 'in-progress' ? '⏳ In Progress' : task.status === 'pending' ? '⏰ Pending' : '✅ Completed'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
