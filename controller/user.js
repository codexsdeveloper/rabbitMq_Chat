const bcrypt = require('bcryptjs');
const { validateUsers, user } = require('../models/user');
const jwt = require('jsonwebtoken');
const Room = require('../models/room');

const responseHandler = require('../middleware/responseHandler')
const VerifyToken = require('../middleware/auth')


//
const Registers = async (data, socket) => {
    console.log("socket:==", socket.id);
    try {
        const { First_Name, Last_Name, Email, Password } = data;
        delete data.en
        const { error } = validateUsers(data)
        if (error) {
            return responseHandler(socket, "signup", { success: false, message: error.details[0].message });
        }
        if (!(Email && Password && First_Name && Last_Name)) {
            return responseHandler(socket, "signup", { success: false, message: "all input required..!" })
        }
        const OldUser = await user.findOne({ Email });

        if (OldUser) {
            return responseHandler(socket, "signup", { success: false, message: "User Already Exist..!" })
        }
        else {
            const bcryptPass = await bcrypt.hash(data.Password, 10)
            const NewUser = new user({
                First_Name: First_Name,
                Last_Name: Last_Name,
                Email: Email,
                Password: bcryptPass,
                SocketId: socket.id
            })
            await NewUser.save()
            console.log('Controller user===', NewUser);
            return responseHandler(socket, "signup", { success: true, data: { NewUser } });
        }
    } catch (error) {
        console.log(error);
    }
}


const Logins = async (data, socket) => {
    try {
        console.log("socket:===", socket.id);
        const { Email, Password } = data
        delete data.en
        const { error } = validateUsers(data)
        if (error) {
            return responseHandler(socket, "login", { success: false, message: error.details[0].message });
        }
        if (!(Email && Password)) {
            return responseHandler(socket, "login", { success: false, message: "all input required..!" })
        }
        let FindUser = await user.findOne({ Email: data.Email })
        if (!FindUser) {
            return responseHandler(socket, "login", { success: false, message: "Incorrect Username & Password..!" })
        }
        if (FindUser) {
            FindUser = await user.findOneAndUpdate({ Email: data.Email }, {
                $set: {
                    SocketId: socket.id
                }
            }, { new: true })
            console.log(FindUser);
        }
        const MatchPassword = await bcrypt.compare(data.Password, FindUser.Password)
        console.log(MatchPassword,FindUser.Password);
        if (MatchPassword) {
            const token = jwt.sign({ user_id: FindUser._id, email: data.Email, Socket_Id: FindUser.SocketId }, process.env.TOKEN_KEY)

            FindUser = VerifyToken(token);
            console.log("user=============", FindUser);
            const sender = FindUser.user_id;
            console.log("UserID:", sender);

            const { roomID: _id } = data;

            let membersData
            membersData = await Room.find({ members: sender });
            console.log("rooms:", membersData);

            membersData.forEach(userRoom => {
                const room = userRoom._id.toString();
                console.log('Room:', room);
                socket.join(room);
            });
            return responseHandler(socket, "login", { success: true, data: { user, token } });
        }
        else{
            return responseHandler(socket, "login", { success: false, message: "Incorrect Username & Password..!" });
        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    Registers,
    Logins
}