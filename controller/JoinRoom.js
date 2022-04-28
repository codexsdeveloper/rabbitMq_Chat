const responseHandler = require('../middleware/responseHandler');
const Room = require('../models/room')
const VerifyToken = require('../middleware/auth');
const mongoose = require('mongoose');
const { date } = require('joi');


const JoinRoom = async (data, socket) => {
    try {
        const user = VerifyToken(data.token)
        console.log("user======", user);
        const sender = user.user_id;
        console.log('user id== ', sender);
        console.log('data====', data);
        let roomData;

        if (!mongoose.isValidObjectId(data.roomID)) {
            return responseHandler(socket, "JoinRoom", { success: false, message: "Incorrect RoomId..!" });
        }
        const roomCheck = await Room.findById({ _id: data.roomID })
        const FindUser = await Room.findOne({members: sender})
        roomData = roomCheck;
        let RoomUpdate;
        console.log(`roomCheck ${roomCheck}`);
        let single = {};
        const members = [];
        if (!roomCheck) {
            const NewRoom = new Room({
                room_name: data.room_name,
                members: [sender],
                createdBy: sender,
                message: [],
                createdAt: new Date()
            })
            RoomUpdate = await NewRoom.save();
        }
         else if(FindUser){
            return responseHandler(socket, "joinRoom", { success: true, message: 'join Room successfully1' });
        }
        else{
             RoomUpdate= await Room.findOneAndUpdate({_id: data.roomID}, {
                $push:{
                    members: sender
                }
            });
            console.log(`New Member Addded...!`);
        }
        console.log(`RoomID:=== ${RoomUpdate._id}`);
        const room = RoomUpdate._id.toString();
        socket.join(room);
        socket.to(room).emit('res', RoomUpdate);

        return responseHandler(socket, "joinRoom", { success: true, message: 'join Room successfully' });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { JoinRoom }