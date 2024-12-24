import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    tasks: [{
        taskName: {
            type: String,
            required: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    }],
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
}, {timestamps: true});

export const Task = mongoose.model('Task', taskSchema);