const {check, validationResult} = require('express-validator');

module.exports = function (app) {
    const chats = require("../controllers/chat.controller.js");

    // Create chat
    app.post("/create_chat",[
        check('user_id').not().isEmpty().trim(),
        check('user_token').not().isEmpty().trim(),
        check('teacher_id').not().isEmpty().trim(),
        check('student_id').not().isEmpty().trim()
    ], chats.createChat);
    
    app.post("/get_list_chat_user",[
        check('user_id').not().isEmpty().trim(),
        check('user_token').not().isEmpty().trim(),
        check('app_role').not().isEmpty().trim(),
        check('page_no').not().isEmpty().trim()
    ], chats.getListChatUser);
    
    app.post("/send_msg",[
        check('user_id').not().isEmpty().trim(),
        check('user_token').not().isEmpty().trim(),
        check('socket_id').not().isEmpty().trim(),
        check('msg').not().isEmpty().trim(),
        check('msg_type').not().isEmpty().trim(),
        check('chat_id').not().isEmpty().trim()
    ], chats.sendMsg);
    
    app.post("/get_chat_messages",[
        check('user_id').not().isEmpty().trim(),
        check('user_token').not().isEmpty().trim(),
        check('chat_id').not().isEmpty().trim(),
        check('reset_count').not().isEmpty().trim(),
        check('page_no').not().isEmpty().trim(),
        check('other_id').not().isEmpty().trim()
    ], chats.getChatMessages);
    

};