const sql = require("./db.js");
const Base = require("./base.model.js");
const sendPush = require("./push.model.js");


//// constructor
const Chat = function (chat) {};

Chat.mdlCreateChat = (req, authData, result) => {
    sql.query("SELECT * from tbl_chat \n\
        where (chat_created_by = ? and chat_created_to = ? ) \n\
        limit 1  ", [req.body.teacher_id, req.body.student_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            if (res.length) {


                sql.query("SELECT profile_pic,name,last_seen,verify_me,socket_id,time_zone,country from tbl_user where user_id = ?", req.body.teacher_id, (err, teacherInfo) => {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    } else {


                        teacherInfo = teacherInfo[0];

                        result(null, {profile_pic: teacherInfo.profile_pic, name: teacherInfo.name, last_seen: teacherInfo.last_seen, verify_me: teacherInfo.verify_me, socket_id: teacherInfo.socket_id, time_zone: teacherInfo.time_zone, country: teacherInfo.country, ...res[0]});
                        return;
                    }
                });



            } else {
                var current_time = new Date(new Date().toUTCString());

                chatData = {
                    chat_created_to: req.body.student_id,
                    chat_created_by: req.body.teacher_id,
                    chat_created_time: current_time
                };
                sql.query("INSERT INTO tbl_chat SET ?", chatData, (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    } else {


                        sql.query("SELECT profile_pic,name,last_seen,verify_me,socket_id,time_zone,country from tbl_user where user_id = ?", chatData.chat_created_by, (err, teacherInfo) => {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                                return;
                            } else {


                                var message2 = "Hi " + teacherInfo[0].name + " I want to know if you can tutor me. Can we chat now? ";
                                message = {
                                    "message_to": req.body.teacher_id,
                                    "message_by": req.body.student_id,
                                    "message": message2,
                                    "chat_id": res.insertId,
                                    "message_type": 5
                                };

                                sql.query("INSERT INTO tbl_chat_message SET ?", message, (err, resMessage) => {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                        return;
                                    } else {
                                        var msg = authData.name + ' has sent you a chat message."';
                                        pishInfo = {};
                                        pishInfo.notification = {
                                            title: authData.name,
                                            body: msg
                                        };

                                        pishInfo.data = {
                                            title: authData.name,
                                            text: msg,
                                            type: 'PUSH_LIKE'
                                        };


                                        sendPush.teacherNotification(req.body.teacher_id, pishInfo);
                                        teacherInfo = teacherInfo[0];

                                        result(null, {chat_id: res.insertId, profile_pic: teacherInfo.profile_pic, name: teacherInfo.name, last_seen: teacherInfo.last_seen, verify_me: teacherInfo.verify_me, socket_id: teacherInfo.socket_id, time_zone: teacherInfo.time_zone, country: teacherInfo.country, ...chatData});
                                        return;
                                    }
                                });



                            }
                        });
                    }
                });
            }

        }


    });
};

Chat.mdlGetListChatUser = (req, result) => {

    var page_no = parseInt(req.body.page_no === undefined ? '1' : req.body.page_no);
    var limit = 10;
    var offset = (page_no * limit) - limit;

    var pagination = " ";
    if (page_no !== null || page_no !== '') {
        pagination = " limit " + limit + " offset " + offset + " ";
    }

    var user_id = req.body.user_id;
    var app_role = req.body.app_role;

    sql.query("SELECT 2 as app_role,t1.unread_count ,t2.id, t1.chat_created_by,t1.chat_created_to, t1.chat_created_time, t1.chat_id,t2.message_by ,t2.message, t2.message_type, t2.created_date, t1.chat_created_by as other_user_id, t3.verify_me,t3.country,t3.time_zone,t3.name, t3.profile_pic,t3.socket_id,IFNULL(t4.block_to,0) as is_block_by_me,(select count(unread_count) from tbl_chat where unread_count != 0 and chat_created_by = ?)as chat_msg,DATE_FORMAT(t3.last_seen,'%Y-%m-%d %T') as last_seen,t3.is_online \n\
      from tbl_chat t1 \n\
      LEFT JOIN tbl_chat_message t2 ON (t2.chat_id = t1.chat_id and t2.id IN ( select MAX(t4.id) as id from tbl_chat_message t4 group by t4.chat_id)) \n\
      JOIN tbl_user t3 ON ((t1.chat_created_by = t3.user_id and t1.chat_created_to = ?) or (t1.chat_created_to = t3.user_id and t1.chat_created_by = ?))  \n\ \n\
      LEFT JOIN tbl_user_block t4 ON ((t1.chat_created_by = t4.block_by and t1.chat_created_to = t4.block_to) or (t1.chat_created_to = t4.block_by and t1.chat_created_by = t4.block_to)) \n\
      where t1.is_chat_active = 1 having is_block_by_me = 0 and IF(app_role = ?, ??=?, ??=?) order by t2.id desc " + pagination + "", [user_id, user_id, user_id, app_role, 't1.chat_created_by', user_id, 't1.chat_created_to', user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            result(null, res);
        }
    });
};

Chat.mdlSendMsg = (req, io, result) => {

    var room = io.sockets.adapter.rooms[req.body.chat_id];


    var socket_id = req.body.socket_id;
    var app_role = parseInt(req.body.app_role);
    console.log('approle: '+app_role);
    var gig_id = req.body.gig_id;
    var UserID = req.body.user_id;
    var chat_id = req.body.chat_id;
    var other_id = req.body.other_id;
    var current_time = new Date(new Date().toUTCString());

    if ((room === undefined || room.sockets[socket_id] !== true)) {
        result(null, {status_code: 2, message: 'room not found'});
        return;
    } else {
        var chat_data = {
            message_by: UserID,
            message_to: other_id,
            gig_id: gig_id,
            chat_id: chat_id,
            message_type: req.body.msg_type,
            message: encodeURI(req.body.msg),
            created_date: current_time
        };

        if (room.length === 2) {
            emit_data = {};
            emit_data.info = chat_data;
            emit_data.msg = "Message sent.";
            emit_data.status = 1;

            io.to(chat_id).emit('new_message', emit_data);

            sql.query("INSERT INTO tbl_chat_message set ?", chat_data, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {

                    try {
                        io.to(chat_id).emit('is_read', {is_read: 1, status_code: 1, message: 'Success'});
                    } catch (e) {
                        console.log(e);
                    }

                    chat_data.id = res.insertId;
                    result(null, chat_data);
                    return;
                }
            });


        } else {
            try {
                emit_data = {};
                emit_data.info = chat_data;
                emit_data.msg = "Message sent.";
                emit_data.status = 1;
                io.sockets.connected[users[other_id]].emit('new_message', emit_data);
            } catch (e) {
                console.log(e);
            }

            sql.query("UPDATE tbl_chat SET unread_count = unread_count + 1 where chat_id = ?", chat_id, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {
                    sql.query("INSERT INTO tbl_chat_message set ?", chat_data, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(null, err);
                            return;
                        } else {


                            sql.query("Select user_id, name, profile_pic, socket_id, DATE_FORMAT(last_seen,'%Y-%m-%d %H:%i:%s') as last_seen, time_zone, country, verify_me from tbl_user where ??=? limit 1", ['user_id', UserID], (err, other_id_info) => {
                                if (err) {
                                    console.log("error: ", err);
                                    result(null, err);
                                    return;
                                } else {
                                    var msg = chat_data.message;
                                    pishInfo = {};
                                    pishInfo.notification = {
                                        title: other_id_info[0]['name'],
                                        body: decodeURI(msg)
                                    };

                                    pishInfo.data = {
                                        title: other_id_info[0]['name'],
                                        text: decodeURI(msg),
                                        type: 9,
                                        chat_id: chat_id,
                                        other_id_info: other_id_info[0]
                                    };

                                    if (app_role === 1) {
                                        sendPush.teacherNotification(other_id, pishInfo);
                                    } else {
                                        sendPush.studentNotification(other_id, pishInfo);
                                    }

                                    chat_data.id = res.insertId;
                                    result(null, chat_data);
                                    return;
                                }
                            });


                        }
                    });
                }
            });

        }

    }

};

Chat.mdlGetChatMessages = (req, result) => {

    if (parseInt(req.body.reset_count)) {

        sql.query("UPDATE tbl_chat SET unread_count = 0 where chat_id = ?", req.body.chat_id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
                try {
                    io.sockets.connected[users[other_id]].emit('is_read', {is_read: 1, status_code: 1, message: 'Success'});
                } catch (e) {
                    console.log(e);
                }
            }

        });
    }

    var page_no = parseInt(req.body.page_no === undefined ? '1' : req.body.page_no);
    var limit = 10;
    var offset = (page_no * limit) - limit;
    var is_teacher = parseInt(req.body.is_teacher);
    var other_id = req.body.other_id;
    var user_id = req.body.user_id;

    sql.query("SELECT t1.*,t2.name,t2.profile_pic,t2.whatsapp_number,t3.gig_status from tbl_chat_message t1\n\
               join tbl_user t2 on t1.message_by = t2.user_id \n\
               left join tbl_gig t3 on t3.gig_id = t1.gig_id  \n\
               where ??=? order by t1.id DESC limit ? offset ?", ['t1.chat_id', req.body.chat_id, limit, offset], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {

            if (is_teacher) {
                sql.query("SELECT t1.gig_id as is_order_running,price,intro_msg,subject_name,hours from tbl_gig t1 \n\
                          left join tbl_subject t2 on t1.subject_id = t2.subject_id   \n\
                          left join tbl_booked_lession t3 on t1.gig_id = t3.gig_id   \n\
                          where ((??=? and ??=?)  and (?? = ? or ?? = ? or ?? = ? or ?? = ?))",
                        ['t3.teacher_id', user_id, 't3.student_id', other_id, 'gig_status', 0, 'gig_status', 3, 'gig_status', 7, 'gig_status', 9], (err, orderInfo) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {

                        res['order_info'] = orderInfo;

                        result(null, res);
                        return;
                    }
                });
            } else {

                sql.query("SELECT t1.gig_id as is_order_running,price,intro_msg,subject_name,hours from tbl_gig t1 \n\
                           left join tbl_subject t2 on t1.subject_id = t2.subject_id   \n\
                           left join tbl_booked_lession t3 on t1.gig_id = t3.gig_id   \n\
                           where ( ??=? and ??=?  and ( gig_status = 0 or gig_status = 3 or gig_status = 7 or gig_status = 9))",
                        ['t3.teacher_id', other_id, 't3.student_id', user_id], (err, orderInfo) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {

                        res['order_info'] = orderInfo;
                        console.log("order_info: ", orderInfo);
                        result(null, res);
                        return;
                    }
                });
            }

        }
    });





};




module.exports = Chat;