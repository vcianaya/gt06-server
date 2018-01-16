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
//AQUI SE DECODIFICA EL MENSJAE DEL GPS 
gps_event.on("parse_data", (data) => {
    parts.start = data.substr(0, 4);
    if (parts.start == '7878') {
        parts.length = parseInt(data.substr(4, 2), 16);
        parts.finish = data.substr(6 + parts.length * 2, 4);
        parts.protocal_id = data.substr(6, 2);
        parts['protocal_id'] = data.substr(6, 2);
        //PUEDE ESTAR EL ERROR AQUI POR EL CODIGO HEXADECIMAL
        if (parts.finish != '0d0a') {
            throw 'finish code incorrect!';
        }

        if (parts.protocal_id == '01') {
            parts.device_id = data.substr(8, 16);
            parts.cmd = 'login_request';
            parts.action = 'login_request';
        } else if (parts.protocal_id == '12') {
            parts.device_id = '';
            parts.data = data.substr(8, parts.length * 2);
            parts.cmd = 'ping';
            parts.action = 'ping';
        } else if (parts.protocal_id == '13') {
            parts.device_id = '';
            parts.cmd = 'heartbeat';
            parts.action = 'heartbeat';
        } else if (parts.protocal_id == '16' || parts.protocal_id == '18') {
            parts.device_id = '';
            parts.data = data.substr(8, parts.length * 2);
            parts.cmd = 'alert';
            parts.action = 'alert';
        } else {
            parts.device_id = '';
            parts.cmd = 'noop';
            parts.action = 'noop';
        }
    } else {
        parts.device_id = '';
        parts.cmd = 'noop';
        parts.action = 'noop';
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