'use-strict'

net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//VARIBALES

//TCP SERVER
var gps_event = new EventEmitter();
net.createServer(function (connection) {
    connection.on('data', function (data) {
        console.log("TCP-SERVER-ON-LINE");
    });
}).on('error', (err) => {
    console.log("Aqui el error del TCP---" + err);
}).listen(5000);




//HTTP SERVER
const app = express();
app.get('/', (req, res) => {
    res.send("INICIADO")
});

const server = http.Server(app);
server.listen(3000);

const io = socketIo(server);

io.on('connection', (socket) => {
    socket.emit('hello', {
        nobre: 'Victor Anaya'
    });
});