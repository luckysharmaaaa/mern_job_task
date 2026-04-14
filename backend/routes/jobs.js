const express = require('express');
const router = express.Router();
const { getJobs, createJob, applyToJob, deleteJob } = require('../controllers/jobController');
const auth = require('../middleware/auth');

router.get('/', getJobs);
router.post('/', auth, createJob);
router.post('/:id/apply', auth, applyToJob);
router.delete('/:id', auth, deleteJob);

module.exports = router;