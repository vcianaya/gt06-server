'use-strict'

net = require('net');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
gt06 = require('./tools/gt06');
//VARIBALES
cont = 0;
//TCP SERVER
net.createServer(function (connection) {
    
    connection.on('data', function (data) {
        vico = gt06.parse_data(data);
        if (vico.protocal_id == '01') {
            cont = cont+1;
            console.log(cont);            
        }        
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