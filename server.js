'use-strict'
EventEmitter = require('events').EventEmitter;
net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//TCP SERVER
var gps_event = new EventEmitter();
net.createServer(function (connection) {
    connection.on('data', function (data) {
        console.log("TCP-SERVER-ON-LINE");
        console.log(data.toString('hex'));
        gps_event.emit("someEvent");
    });        
}).listen(5000);
//HTTP SERVER
const app = express();
app.get('/', (req, res)=>{
    res.send("INICIADO")
});

const server = http.Server(app);
server.listen(3000);

const io = socketIo(server);

io.on('connection', (socket)=>{
    console.log('Algien se a connectado');
    socket.emit('hello',{
        nobre: 'Victor Anaya'
    });
});

gps_event.on("someEvent", function () {
    console.log("event has occured");
});