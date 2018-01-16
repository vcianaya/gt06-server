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
        try {
            gps_event.emit("parse_data", data.toString('hex'));
        } catch (error) {
            console.log("Error Emit event try");
            
        }
    });        
}).on('error', (err) => {
    console.log("Aqui el error del TCP---"+err);
    
}).listen(5000);

gps_event.on("parse_data", (data) => {
    parts.start = data.substr(0, 4);
    if (parts.start == '7878') {
        parts.length = parseInt(data.substr(4, 2), 16);
        parts.finish = data.substr(6 + parts.length * 2, 4);
        parts.protocal_id = data.substr(6, 2);
    }
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