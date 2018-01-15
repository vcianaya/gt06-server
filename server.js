'use-strict'
net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//TCP SERVER
net.createServer(function (connection) {
    connection.on('data', function (data) {
        console.log("TCP-SERVER-ON-LINE");
        console.log(data);        
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