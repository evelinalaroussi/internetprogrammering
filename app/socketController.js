/* jslint node: true */
"use strict";

var model = require('./model.js');

module.exports = function (socket, io) {

  socket.on('join', function (req) {
   // console.log(req);
    var name = req.follower;
    socket.join(name);
   // console.log('A user joined ' + name);
   // console.log(socket.id);
    io.sockets.connected[socket.id].emit('join', req);

  });

    socket.on('unfollow', function (req) {
    console.log(req);
    var name = req.follower;
    socket.join(name);
    //console.log('A user unfollowed ' + name);
    io.sockets.connected[socket.id].emit('unfollow', req);


  });

};
