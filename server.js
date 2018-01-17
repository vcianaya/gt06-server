'use-strict'

net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//VARIBALES
cont = 0;
//TCP SERVER
net.createServer(function (connection) {
    connection.on('data', function (data) {
        cont = cont + 1;
        console.log("TCP-SERVER-ON-LINE-->" + cont);

    });
}).on('error', (err) => {
    console.log("Aqui el error del TCP---" + err);
}).on('end', () => {
    console.log('disconnected from server');
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