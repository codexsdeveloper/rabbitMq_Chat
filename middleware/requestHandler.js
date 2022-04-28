const UserController = require('../controller/user');
const joinRoomController = require('../controller/JoinRoom')
const sendMessageController = require('../controller/SendMessage')
const requestHandler = (body, socket, io) => {
    const { en, data, token } = body
    console.log("data===", body);

    switch (en) {
        case 'signup':
            UserController.Registers(body, socket);
            break;
        case 'login':
            UserController.Logins(body, socket);
            break;
        case 'joinRoom':
            // console.log("hello", body);
            joinRoomController.JoinRoom(body, socket, io)
            break;
        case 'sendMessage':
            console.log("hello", body);
            sendMessageController.sendMessage(body, socket, io)
            break;
    }
}
module.exports = requestHandler
