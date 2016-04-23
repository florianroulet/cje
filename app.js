(function () {
   'use strict';

    var http = require('http'),
    fs = require('fs'),
    app = require('express')();

    const PORT = 9090;
    // Chargement du fichier index.html affiché au client
    var server = http.Server(app);
    var io = require('socket.io').listen(server);

    app.get('/', function(req, res){
      res.sendFile(__dirname + '/index.html');
    });

    var raspberryConnected = false;

    var nsp = io.of('/raspi');
    var client = io.of('/client');

    // gestion du robot
    nsp.on('connection', function(socket){
        console.log('raspberry connected');
        raspberryConnected = true;
        client.emit('status', { raspberryStatus: raspberryConnected});

        socket.on('disconnect', function() {
            console.log('raspberry disconnected');
            raspberryConnected = false;
            client.emit('status', { raspberryStatus: raspberryConnected});
        });
    });

    // gestion des client web
    client.on('connection', function (socket) {

        console.log('Un client est connecté !');
        socket.emit('connection', {
                                    message: 'Vous êtes bien connecté !',
                                    raspberryStatus: raspberryConnected
                                  });

        socket.emit('status', { raspberryStatus: raspberryConnected});


        // Quand le serveur reçoit un signal de type "movement" du client
        socket.on('movement', function (message) {
            console.log('Server movement message :' + message);
            nsp.emit('movement', message);
        });
    });

    server.listen(PORT, function () {
        console.log('Server listenning on port ' + PORT);
    });
}());

