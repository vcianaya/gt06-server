'use-strict'
EventEmitter = require('events').EventEmitter;
net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//VARIBALES
var parts={};
var gps={};
var __count = 1;
//TCP SERVER
var gps_event = new EventEmitter();
net.createServer(function (connection) {
    connection.on('data', function (data) {
        console.log("TCP-SERVER-ON-LINE");        
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
    if (this.getUID() === false && typeof (parts.device_id) === 'undefined') {
        throw 'The adapter doesn\'t return the device_id and is not defined';
    }

    if (parts === false) { //something bad happened
        _this.do_log('The message (' + data + ') can\'t be parsed. Discarding...');
        return;
    }

    if (typeof (parts.cmd) === 'undefined') {
        throw 'The adapter doesn\'t return the command (cmd) parameter';
    }

    //If the UID of the devices it hasn't been setted, do it now.
    if (this.getUID() === false) {
        this.setUID(parts.device_id);
        console.log('Llege aqui');
        
    }
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

/****************************************
 SOME SETTERS & GETTERS
 ****************************************/
this.getName = function () {
    return this.name;
};

this.setName = function (name) {
    this.name = name;
};

this.getUID = function () {
    return gps.uid;
};

this.setUID = function (uid) {
    gps.uid = uid;
};

this.authorize = function () {
    var length = '05';
    var protocal_id = '01';
    var serial = f.str_pad(this.__count, 4, 0);
    var str = length + protocal_id + serial;
    this.__count++;
    var buff = new Buffer('787805010001d9dc0d0a', 'hex');    
    this.device.send(buff);
};