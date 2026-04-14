import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.log('❌ No token available');
        setLoading(false);
        return;
      }

      try {
        console.log('📊 Fetching dashboard stats...');
        
        const res = await axios.get('https://mern-job-task.onrender.com/api/dashboard/stats', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Stats received:', res.data);
        setStats(res.data);
        setError(false);
        
      } catch (err) {
        console.error("❌ Dashboard Fetch Error:", err.response?.data || err.message);
        setError(true);
        
        setStats({
          totalJobs: 0,
          myApplications: 0,
          tasks: { todo: 0, inProgress: 0, done: 0 }
        });
        
        if (err.response?.status === 401) {
          toast.error("Please login again");
        } else {
          toast.error(err.response?.data?.message || "Failed to fetch dashboard stats");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-gray-500 font-medium">Failed to load dashboard</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome back, <span className="text-indigo-600">{user?.name || 'Developer'}</span>!
        </h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your projects today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Jobs" 
          value={stats?.totalJobs || 0} 
          icon={<Briefcase size={24} className="text-blue-600" />} 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Applications" 
          value={stats?.myApplications || 0} 
          icon={<CheckCircle size={24} className="text-green-600" />} 
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Tasks To-Do" 
          value={stats?.tasks?.todo || 0} 
          icon={<Clock size={24} className="text-orange-600" />} 
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Tasks Done" 
          value={stats?.tasks?.done || 0} 
          icon={<CheckCircle size={24} className="text-purple-600" />} 
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Summary</h2>
          <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <AlertCircle className="text-indigo-600 mt-1 shrink-0" />
            <div>
              <p className="text-indigo-900 font-medium">You're doing great!</p>
              <p className="text-indigo-700 text-sm">
                You currently have <strong>{stats?.tasks?.todo || 0} pending tasks</strong> and 
                <strong> {stats?.tasks?.inProgress || 0} in progress</strong>. 
                Keep track of your job hunt in the Jobs section.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-500 to-purple-500 p-8 rounded-2xl shadow-lg text-white">
          <h2 className="text-lg font-bold mb-2">Pro Tip</h2>
          <p className="text-indigo-100 text-sm leading-relaxed">
            Consistency is key! Update your task board daily to stay organized.
          </p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-400 uppercase font-black tracking-widest">{title}</p>
      <h3 className="text-4xl font-black mt-2 text-gray-900 tracking-tight">{value}</h3>
    </div>
    <div className={`p-4 ${bgColor} rounded-2xl`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;