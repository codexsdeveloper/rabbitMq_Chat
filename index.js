require("dotenv").config();
const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const { argv } = require('process');
const app = express();
require("./config/database").connect()

const requestHandler = require('./middleware/requestHandler')
const { consumer } = require('./rabbitmq/consumer')

const server = http.createServer(app)

const io = socket(server)

const port = process.argv[2] || 9796

const publicDirectoryPath = path.join(__dirname, './public')
app.use(express.static(publicDirectoryPath))

//Making IO Globle Obj
global.io = io;
global.socket = socket

//on connection 
io.on("connection", (socket) => {
    console.log(`New WebSocket Connected`, socket.id);

    socket.on('req', (body) => {
        console.log("body Data:===", body);
        requestHandler(body, socket, io);
    })
    consumer()
    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} Disconnected..!`);
    });
});

server.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
})