const express = require('express');
const router = express.Router();
const {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    addLeadNote,
    getDashboardStats
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createLead).get(protect, getLeads);
router.get('/dashboard', protect, getDashboardStats);
router.route('/:id').get(protect, getLeadById).put(protect, updateLead).delete(protect, deleteLead);
router.post('/:id/notes', protect, addLeadNote);

module.exports = router;
