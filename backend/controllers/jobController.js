const Job = require('../models/Job');

// Get all jobs
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Create a job
exports.createJob = async (req, res) => {
    try {
        const { title, company, location, salary, description, jobType } = req.body;
        const newJob = new Job({
            title,
            company,
            location,
            salary,
            description,
            jobType,
            postedBy: req.user.id
        });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(500).json({ message: "Job creation failed" });
    }
};

// Apply to a job
exports.applyToJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        
        if (job.applicants.includes(req.user.id)) {
            return res.status(400).json({ message: "Already applied" });
        }
        
        job.applicants.push(req.user.id);
        await job.save();
        res.json({ message: "Applied successfully" });
    } catch (err) {
        res.status(500).json({ message: "Application failed" });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
};