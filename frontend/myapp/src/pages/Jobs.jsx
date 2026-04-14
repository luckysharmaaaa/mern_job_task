import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Briefcase, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
const res = await axios.get('https://mern-job-task.onrender.com/api/jobs');      // Ensure res.data is an array to avoid map errors
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(`https://mern-job-task.onrender.com/api/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Applied Successfully!");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    }
  };

  // FIX: Added optional chaining (?.) and fallback empty string ("")
  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Job Board</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs or companies..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            // FIX: Ensure applicants is an array before calling includes
            const isApplied = job.applicants?.includes(user?.id) || false;

            return (
              <div key={job._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{job.title || "No Title"}</h2>
                    <p className="text-indigo-600 font-medium">{job.company || "Unknown Company"}</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {job.jobType || "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><MapPin size={16}/> {job.location || "N/A"}</div>
                  <div className="flex items-center gap-2"><DollarSign size={16}/> {job.salary || "Not Specified"}</div>
                  <div className="flex items-center gap-2"><Briefcase size={16}/> MERN Stack</div>
                </div>

                <button
                  onClick={() => handleApply(job._id)}
                  disabled={isApplied}
                  className={`w-full py-2 rounded-lg font-bold transition-colors ${
                    isApplied
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isApplied ? 'Already Applied' : 'Apply Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Jobs;