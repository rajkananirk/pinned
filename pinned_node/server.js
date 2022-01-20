const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const moment = require('moment');
const upload = multer({dest: 'uploads/'});
const app = express();

// it's need for socket.ios
const server = require('http').createServer(app);

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));
//socket.io
io = require('socket.io')(server);
app.set('socketio', io);


// simple route
app.get("/", (req, res) => {
       console.log('Welcome to Pinned api application.');
       res.json({message: "Welcome to Pinned api application."});

});


global.users = [];
//app.set('users', users);

io.on('connection', function (socket) {

       console.log('this is my socket_id:' + socket.id);

       socket.on('socket_register', function (data) {
              const sql = require("./app/models/db.js");

              var updateData = {
                     socket_id: socket.id
              };
              sql.query("UPDATE users SET ? WHERE id = ?", [updateData, data.user_id], (err, res) => {
                     if (err) {
                            console.log("error: ", err);
                     }
              });

              console.log('socket_register');

              try {
                     var CurDaytime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
                     io.sockets.emit('online_status', {user_id: data.user_id, socket_id: socket.id, time: CurDaytime, time_zone: data.time_zone, status: 'online'});
              } catch (e) {
                     console.log(e);
              }
              var user_id = data.user_id;
              users[user_id] = socket.id;


       });

       socket.on('disconnect', function (data) {
              console.log('socket disconncted');
              const sql = require("./app/models/db.js");
              var CurDaytime = moment.utc().format("YYYY-MM-DD HH:mm:ss");


              var updateData = {
                     socket_id: '',
              };

              sql.query("UPDATE users SET ? WHERE socket_id = ?", [updateData, socket.id], (err, res) => {
                     if (err) {
                            console.log("error: ", err);
                     } else {
                            try {
                                   io.sockets.emit('online_status', {user_id: data.user_id, socket_id: socket.id, time: CurDaytime, time_zone: data.time_zone, status: 'offline'});
                            } catch (e) {
                                   console.log(e);
                            }

                     }
              });
       });

       socket.on('join_room', function (data) {

              var user_id = data.user_id;
              var chat_id = data.chat_id;

              if ((null === user_id || user_id === "") || (null === chat_id || chat_id === "")) {

                     if (io.sockets.connected[socket.id]) {
                            io.sockets.connected[socket.id].emit('join_room', {status_code: 0, message: 'Parameter Missing', en: 'join_room'});
                            return;
                     }
              }

              socket.join(chat_id);
              console.log('join_room');
              if (io.sockets.connected[socket.id]) {
                     io.sockets.connected[socket.id].emit('join_room', {status_code: 1, message: 'Success', en: 'join_room'});
              }

       });

       socket.on('left_room', function (data) {
              console.log('left_room');
              socket.leave(socket.room);
              if (io.sockets.connected[socket.id]) {
                     io.sockets.connected[socket.id].emit('left_room', {status_code: 1, message: 'Success', en: 'left_room'});
              }
       });


});



require("./app/routes/chat.routes.js")(app);
require("./app/routes/user.routes.js")(app, upload);


// set port, listen for requests
server.listen(3000, () => {
       console.log("Server is running on port 3000.");
});
