var mongoose = require('mongoose');
const { Socket } = require('socket.io');
const Joi = require('joi')

const userScama = new mongoose.Schema({
    First_Name: {
        type: String,
        default: null
    },
    Last_Name: {
        type: String,
        default: null
    },
    Email: {
        type: String,
        unique: true
    },
    Password: {
        type: String,
    },
    SocketId: {
        type: String,
        default: "",
    }
},
    {
        timestamps: true
    });

    function validateUsers(user) {
        return Joi.object({
            First_Name: Joi.string().min(3).max(50).optional(),
            Last_Name: Joi.string().min(3).max(50).optional(),
            Email: Joi.string().email().required(),
            Password: Joi.string().min(6).max(16).required(),
        }).validate(user);
    }

const user = mongoose.model('UsersRoom', userScama)

module.exports = {
    user,
    validateUsers
}