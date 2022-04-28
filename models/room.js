const { string } = require('joi');
const mongoose = require('mongoose');


const User_Rooms = new mongoose.Schema({
    room_name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            default: []
        }
    ],
    message: {
        type: Array,
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})


const Rooms = mongoose.model('Rooms', User_Rooms)

module.exports = Rooms