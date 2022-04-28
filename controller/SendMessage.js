const Room = require('../models/room');
const responseHandler = require('../middleware/responseHandler');
const VerifyToken = require('../middleware/auth');
const { producer } = require('../rabbitmq/producer');

exports.sendMessage = async (data, socket, io) => {
    console.log("Data", data);
    try {
        const user = VerifyToken(data.token)
        console.log("user:======>", user);
        const sender = user.user_id;
        console.log("userID:", sender);

        const roomCheck = await Room.findOne({ _id: data.roomID, members: sender })
        console.log("roomfind:=>", roomCheck);

        if (roomCheck) {
            const msgData = await Room.findOneAndUpdate({
                _id: roomCheck._id
            },
                {
                    $push: {    
                        message: {
                            senderID: sender,
                            message: data.message
                        }
                    }
                }
            )
            console.log(msgData);
        }
        else{
            return responseHandler(socket, "sendMessage", { success: false, message: 'Room not 😒 found!!!' });
        }
        console.log("pro:=", data.message);
        producer(data.message)

    } catch (error) {
        console.log(error);
    }
}