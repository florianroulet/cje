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


    var nsp = io.of('/raspi');
    nsp.on('connection', function(socket){
      console.log('raspberry connected'):
    });


    // Quand un client se connecte, on le note dans la console
    io.sockets.on('connection', function (socket) {

        console.log('Un client est connecté !');
        socket.emit('connection', 'Vous êtes bien connecté !')


        // Quand le serveur reçoit un signal de type "movement" du client
        socket.on('movement', function (message) {
            console.log('Server movement message :' + message);

            nsp.emit('movement', message);
//            io.of('/raspi').clients(function(error, clients){
//              if (error) throw error;
//              console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
//            });


//            switch(message) {
//                case "forward":
//                forward();
//                    break;
//                case "backward":
//                backward();
//                    break;
//                case "left":
//                left();
//                    break;
//                case "right":
//                //right();
//                    break;
//            }
        });
    });

    server.listen(8080, function () {
        console.log('Server listenning on port 8080');
    });
}());

