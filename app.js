(function () {
   'use strict';

    var http = require('http'),
    fs = require('fs'),
    app = require('express')();

    // Chargement du fichier index.html affiché au client
    var server = http.Server(app);
    var io = require('socket.io').listen(server);

    app.get('/', function(req, res){
      res.sendFile(__dirname + '/index.html');
    });

    var raspberryConnected = false;
    var nsp = io.of('/raspi');
    nsp.on('connection', function(socket){
      console.log('raspberry connected');
        raspberryConnected = true;
    });


    // Quand un client se connecte, on le note dans la console
    io.sockets.on('connection', function (socket) {

        console.log('Un client est connecté !');
        socket.emit('connection', {
                                    message: 'Vous êtes bien connecté !',
                                    raspberryStatus: raspberryConnected
                                  })


        // Quand le serveur reçoit un signal de type "movement" du client
        socket.on('movement', function (message) {
            console.log('Server movement message :' + message);

            nsp.emit('movement', message);
        });
    });

    server.listen(8080, function () {
        console.log('Server listenning on port 8080');
    });
}());

