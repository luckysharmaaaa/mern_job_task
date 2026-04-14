import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, X, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', status: 'pending' });

  useEffect(() => {
    fetchTasks();
  }, [token]); // Add token dependency

  const fetchTasks = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      console.log('🔍 Fetching tasks with token...');
      
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Response received:', res.data);
      
      // ✅ FIXED - Access res.data.tasks OR res.data (array)
      const taskList = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(taskList);
      console.log(`📋 Loaded ${taskList.length} tasks`);
      
    } catch (err) {
      console.error('❌ Fetch Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load tasks");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      // ✅ Validate required fields
      if (!formData.title.trim()) {
        toast.error("Task title is required");
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Task description is required");
        return;
      }

      console.log('📝 Creating task:', formData);

      const res = await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Task created:', res.data);
      toast.success("Task Created!");
      setIsModalOpen(false);
      setFormData({ title: '', description: '', priority: 'medium', status: 'pending' });
      
      // Refresh tasks
      fetchTasks();
      
    } catch (err) {
      console.error('❌ Create Error:', err.response?.data || err.message);
      
      // Better error messages
      if (err.response?.status === 401) {
        toast.error("Please login again");
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to create task");
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      console.log(`✏️ Updating task ${id} to ${newStatus}`);

      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, 
        { status: newStatus }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Task updated:', res.data);
      toast.success("Task Updated");
      fetchTasks();
      
    } catch (err) {
      console.error('❌ Update Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      console.log(`🗑️ Deleting task ${id}`);

      const res = await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Task deleted:', res.data);
      toast.success("Task Deleted");
      fetchTasks();
      
    } catch (err) {
      console.error('❌ Delete Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  const columns = [
    { id: 'pending', title: 'To Do', border: 'border-blue-500' },
    { id: 'in-progress', title: 'In Progress', border: 'border-yellow-500' },
    { id: 'completed', title: 'Done', border: 'border-green-500' }
  ];

  // ✅ Helper function to get next status
  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'pending') return 'in-progress';
    if (currentStatus === 'in-progress') return 'completed';
    return 'pending';
  };

  // ✅ Helper function to get previous status
  const getPreviousStatus = (currentStatus) => {
    if (currentStatus === 'completed') return 'in-progress';
    if (currentStatus === 'in-progress') return 'pending';
    return 'in-progress';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Task Board</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus size={20}/> <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map(col => (
          <div key={col.id} className="bg-gray-100/50 p-5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="font-bold text-gray-700 uppercase text-xs tracking-widest">{col.title}</h2>
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>

            <div className="space-y-4">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task._id} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${col.border} hover:shadow-md transition-all group`}>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex mt-6 pt-4 border-t border-gray-50 items-center justify-between">
                    <div className="flex gap-2">
                      {col.id !== 'pending' && (
                        <button 
                          onClick={() => updateStatus(task._id, getPreviousStatus(task.status))} 
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Move Back"
                        >
                          <ChevronLeft size={18}/>
                        </button>
                      )}
                      {col.id !== 'completed' && (
                        <button 
                          onClick={() => updateStatus(task._id, getNextStatus(task.status))} 
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Move Forward"
                        >
                          <ChevronRight size={18}/>
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => deleteTask(task._id)} 
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-800">New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={24}/>
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Finish landing page"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Description *</label>
                <textarea 
                  required
                  placeholder="e.g. Create responsive design and add animations"
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority Level</label>
                <select 
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
