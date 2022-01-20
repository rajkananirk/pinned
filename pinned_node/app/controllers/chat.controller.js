const Chat = require("../models/chat.model.js");
const Auth = require("../models/auth.model.js");
const {check, validationResult} = require('express-validator');

//chat module
exports.createChat = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    ObjInfo = {
        user_id: req.body.user_id,
        user_token: req.body.user_token
    };

    Auth.findById(ObjInfo, (err, authData) => {
        if (err) {
            res.send(err);
        } else {

            if (authData.isData) {

                Chat.mdlCreateChat(req,authData, (err, chatData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resChatData = {};
                        resChatData.info = chatData;
                        resChatData.msg = 'Chat created Successfully.';
                        resChatData.status = 1;
                        res.send(resChatData);
                    }

                });

            } else {
                res.send({
                    msg: 'Unauthorised User.',
                    status_code: 2
                });
            }

        }
    });
};

exports.getListChatUser = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    ObjInfo = {
        user_id: req.body.user_id,
        user_token: req.body.user_token
    };

    Auth.findById(ObjInfo, (err, authData) => {
        if (err) {
            res.send(err);
        } else {

            if (authData.isData) {

                Chat.mdlGetListChatUser(req, (err, listChatUserData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resListChatUserData = {};
                        resListChatUserData.info = listChatUserData;
                        resListChatUserData.msg = 'Chats get Successfully.';
                        resListChatUserData.status = 1;
                        res.send(resListChatUserData);
                    }

                });

            } else {
                res.send({
                    msg: 'Unauthorised User.',
                    status_code: 2
                });
            }

        }
    });
};

exports.sendMsg = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    ObjInfo = {
        user_id: req.body.user_id,
        user_token: req.body.user_token
    };

    Auth.findById(ObjInfo, (err, authData) => {
        if (err) {
            res.send(err);
        } else {

            if (authData.isData) {
                var io = req.app.get('socketio');
                Chat.mdlSendMsg(req, io, (err, msgData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resMsgData = {};
                        resMsgData.info = msgData;
                        resMsgData.msg = 'Message sent.';
                        resMsgData.status = 1;
                        res.send(resMsgData);
                    }

                });

            } else {
                res.send({
                    msg: 'Unauthorised User.',
                    status_code: 2
                });
            }

        }
    });


};

exports.getChatMessages = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    ObjInfo = {
        user_id: req.body.user_id,
        user_token: req.body.user_token
    };

    Auth.findById(ObjInfo, (err, authData) => {
        if (err) {
            res.send(err);
        } else {

            if (authData.isData) {

                Chat.mdlGetChatMessages(req, (err, chatMessages) => {
                    if (err) {
                        res.send(err);
                    } else {
                        var page_no = parseInt(req.body.page_no) + 1;
//                        console.log(chatMessages);
                        resChatMessages = {};
                        resChatMessages.info = chatMessages;
                        resChatMessages.orders = chatMessages['order_info'];
                        resChatMessages.msg = 'Got chat messages.';
                        resChatMessages.next_page_no = page_no;
                        resChatMessages.status = 1;
                        res.send(resChatMessages);
                    }

                });

            } else {
                res.send({
                    msg: 'Unauthorised User.',
                    status_code: 2
                });
            }

        }
    });


};

exports.DEMO = (req, res) => {
    var io = req.app.get('socketio');
    var socket_id = req.body.socket_id;


    console.log(socket_id);

//    io.sockets.emit("foo", 'test_foo');

    try {
        io.sockets.connected[socket_id].emit("test_event", "test_event_data");
    } catch (e) {
        console.log(e);
    }
//    io.to('my_room_1').emit('my_room_test_event','ashish');
    res.send([]);
};

