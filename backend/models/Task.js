const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true
    },
    description: { 
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'in-progress', 'completed'],  // ✅ FIXED - Added 'in-progress'
        default: 'pending' 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema, 'task');
