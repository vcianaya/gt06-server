'use-strict'
EventEmitter = require('events').EventEmitter;
net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//VARIBALES
var parts={};
//TCP SERVER
var gps_event = new EventEmitter();
net.createServer(function (connection) {
    connection.on('data', function (data) {
        console.log("TCP-SERVER-ON-LINE");
        console.log(data.toString('hex'));
        gps_event.emit("parse_data", data.toString('hex'));
    });        
}).listen(5000);

gps_event.on("parse_data", (data) => {
    parts.start = data.substr(0, 4);
    console.log(parts);
});

gps_event.on('error', () => console.log('-----------ERROR ENCONTRADO-----'));

//HTTP SERVER
const app = express();
app.get('/', (req, res)=>{
    res.send("INICIADO")
});

const server = http.Server(app);
server.listen(3000);

const io = socketIo(server);

io.on('connection', (socket)=>{    
    socket.emit('hello',{
        nobre: 'Victor Anaya'
    });
});