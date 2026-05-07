const Lead = require('../models/leadModel');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
    const { name, companyName, email, phoneNumber, leadSource, status, estimatedDealValue } = req.body;

    const lead = await Lead.create({
        name,
        companyName,
        email,
        phoneNumber,
        leadSource,
        status,
        estimatedDealValue,
        assignedSalesperson: req.user._id
    });

    if (lead) {
        res.status(201).json(lead);
    } else {
        res.status(400).json({ message: 'Invalid lead data' });
    }
};

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
    const { status, leadSource, assignedSalesperson, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (leadSource) query.leadSource = leadSource;
    if (assignedSalesperson) query.assignedSalesperson = assignedSalesperson;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const leads = await Lead.find(query).populate('assignedSalesperson', 'name email');
    res.json(leads);
};

// @desc    Get lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
    const lead = await Lead.findById(req.params.id).populate('assignedSalesperson', 'name email').populate('notes.createdBy', 'name');

    if (lead) {
        res.json(lead);
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        lead.name = req.body.name || lead.name;
        lead.companyName = req.body.companyName || lead.companyName;
        lead.email = req.body.email || lead.email;
        lead.phoneNumber = req.body.phoneNumber || lead.phoneNumber;
        lead.leadSource = req.body.leadSource || lead.leadSource;
        lead.status = req.body.status || lead.status;
        lead.estimatedDealValue = req.body.estimatedDealValue !== undefined ? req.body.estimatedDealValue : lead.estimatedDealValue;

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        await Lead.deleteOne({ _id: req.params.id });
        res.json({ message: 'Lead removed' });
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addLeadNote = async (req, res) => {
    const { content } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
        const note = {
            content,
            createdBy: req.user._id
        };

        lead.notes.push(note);
        await lead.save();
        res.status(201).json({ message: 'Note added' });
    } else {
        res.status(404).json({ message: 'Lead not found' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/leads/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const wonLeads = await Lead.countDocuments({ status: 'Won' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    const leads = await Lead.find({});
    const totalEstimatedValue = leads.reduce((acc, lead) => acc + lead.estimatedDealValue, 0);
    const totalWonValue = leads.filter(l => l.status === 'Won').reduce((acc, lead) => acc + lead.estimatedDealValue, 0);

    res.json({
        totalLeads,
        newLeads,
        qualifiedLeads,
        wonLeads,
        lostLeads,
        totalEstimatedValue,
        totalWonValue
    });
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    deleteLead,
    addLeadNote,
    getDashboardStats
};
