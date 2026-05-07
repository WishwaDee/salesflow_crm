const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const leadSchema = mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    leadSource: { type: String, required: true },
    assignedSalesperson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        required: true,
        enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
        default: 'New'
    },
    estimatedDealValue: { type: Number, default: 0 },
    notes: [noteSchema]
}, {
    timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
