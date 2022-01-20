const sql = require("./db.js");
const Base = require("./base.model.js");
const sendPush = require("./push.model.js");
const transporter = require("./email.model.js");
const moment = require('moment');
const fs = require('fs');
const User = function (user) {};

User.findExits = (Arrwhere, result) => {

    baseTable = 'tbl_user';
    baseIArr = '`thirdparty_id` != ' + Arrwhere.thirdparty_id + ' and `email` = "' + Arrwhere.email + '"';
    Base.findExits(baseTable, baseIArr, (err, data) => {
        if (err) {
            result(null, err);
            return;

        } else {
            result(null, data);
            return;
        }
    });
};

User.create = (user_info, result) => {

    baseTable = 'tbl_user';
    baseIArr = 'thirdparty_id = ' + user_info.thirdparty_id;
    Base.findById(baseTable, baseIArr, (err, data) => {

        if (err) {
            result(err, null);
            return;
        } else {

            if (data.user_id == 0) {

                sql.query("INSERT INTO tbl_user SET ?", user_info, (err, res) => {

                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    }
                    user_info.is_new_user = 1;

                });

                baseTable = 'tbl_user';
                baseIArr = 'thirdparty_id = ' + user_info.thirdparty_id;

                Base.findById(baseTable, baseIArr, (err, data) => {

                    if (err) {
                        result(null, err);
                        return;

                    } else {
                        data.teacher_subjects = [];
                        result(null, data);
                        return;
                    }
                });


            } else {
                user_info.is_new_user = 0;

                sql.query("UPDATE tbl_user SET  user_latitude = ?,user_longitude =?, time_zone=?  WHERE thirdparty_id =? ",
                        [user_info.user_latitude, user_info.user_longitude, user_info.time_zone, user_info.thirdparty_id], (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    }
                });

                Base.findById(baseTable, baseIArr, (err, data) => {

                    if (err) {
                        result(err, null);
                        return;

                    } else {

                        sql.query("SELECT * FROM tbl_subjects_for_teacher where user_id=?", [data.user_id], (err, res) => {
                            if (err) {
                                console.log("error: ", err);
                                result(null, err);
                                return;
                            } else {
//                                console.log("Subjects: ", res);
                                data.teacher_subjects = res;
                                result(null, data);
                                return;
                            }
                        });


                    }
                });

            }
        }


    });

};

User.manage_token = (tokenObj, result) => {

    baseTable = 'tbl_token';
    baseIArr = '`device_id` = "' + tokenObj.device_id + '" and `app_role` = ' + tokenObj.app_role + ' and `user_id` = "' + tokenObj.user_id + '"';

    Base.findExits(baseTable, baseIArr, (err, data) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;

        } else {
//            result(null, data);
//            console.log(data);
            if (data) {
                sql.query("UPDATE tbl_token SET device_token = ?, user_token=?  WHERE device_id =? and user_id =? and app_role=? ",
                        [tokenObj.device_token, tokenObj.user_token, tokenObj.device_id, tokenObj.user_id, tokenObj.app_role], (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {
                        result(null, res);
                        return;
                    }
                });
            } else {
                sql.query("INSERT INTO tbl_token SET ?", tokenObj, (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {
                        result(null, res);
                        return;
                    }
                });
            }


        }
    });
};

User.logoutData = (tokenObj, result) => {
    device_id = tokenObj.device_id;
    app_role = tokenObj.app_role;

    sql.query("DELETE FROM tbl_token where device_id =? and app_role= ?", [device_id, app_role], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            result(null, res);
            return;
        }
    });
};

User.mdlUpdateProfile = (req, result) => {
    updateData = {};
    updateData.user_id = req.body.user_id;


    if (req.body.about) {
        updateData.about = req.body.about;
    }

    if (req.body.age) {
        updateData.age = req.body.age;
    }

    if (req.body.school) {
        updateData.school = req.body.school;
    }

    if (req.body.gender) {
        updateData.gender = req.body.gender;
    }

    if (req.body.paypal_id) {
        updateData.paypal_id = req.body.paypal_id;
    }

    if (req.body.whatsapp_number) {
        updateData.whatsapp_number = req.body.whatsapp_number;
    }

    if (req.body.is_online) {
        updateData.is_online = req.body.is_online;
    }

    if (req.body.verify_me) {
        updateData.verify_me = req.body.verify_me;
    }

    if (req.file) {
        profile_pic = req.file.filename;
        updateData.profile_pic = 'uploads/' + profile_pic;
    }


    sql.query("UPDATE tbl_user SET ? WHERE user_id = ?", [updateData, req.body.user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            sql.query("SELECT * FROM tbl_user WHERE user_id = ?", [req.body.user_id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {
                    result(null, res);
                    return;
                }
            });
        }
    });
};

User.mdlupdateUserImages = (req, result) => {
    updateData = [];

    if (req.files) {
        var i = 0;
        for (req.files['images'] in req.files) {
            console.log(req.files[i].filename);
            profile_pic = req.files[i].filename;
            updateData[i] = ['uploads/' + profile_pic, req.body.user_id];
            i++;
        }

        sql.query("INSERT INTO tbl_user_image (image_url,user_id) VALUES ? ", [updateData], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
//                console.log(res);
                result(null, res);
                return;
            }
        });

    } else {
        result(null, 1);
    }




};

User.mdlUpdateTeachereSubjects = (req, result) => {

    if (req.body.subjects) {
        updateData = JSON.parse(req.body.subjects);

        sql.query("DELETE FROM tbl_subjects_for_teacher WHERE user_id = ?", [req.body.user_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
                sql.query("INSERT INTO tbl_subjects_for_teacher (user_id,subject_id) VALUES ? ", [updateData], (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {
                        sql.query("SELECT * FROM tbl_subjects_for_teacher WHERE user_id = ?", [req.body.user_id], (err, res) => {
                            if (err) {
                                console.log("error: ", err);
                                result(null, err);
                                return;
                            } else {
//                        console.log(res);
                                result(null, res);
                                return;
                            }
                        });
                    }
                });
            }
        });



    }
};

User.mdlGetTeacherSubject = (req, result) => {
    sql.query("SELECT t1.*,IFNULL(t2.subject_teacher_id,0) as is_on FROM tbl_subject t1 \n\
                left join tbl_subjects_for_teacher t2 on t1.subject_id = t2.subject_id \n\
                and t2.user_id = ?", [req.body.other_user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
//                        console.log(res);
            result(null, res);
            return;
        }
    });
};

User.mdlgetAllSubject = (req, result) => {
    var search_str = '';
    if (req.body.search_str) {
        var search = req.body.search_str;
        search_str = "where subject_name like '" + search + "%'";
    }

    sql.query("SELECT * FROM tbl_subject " + search_str, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
//                        console.log(res);
            result(null, res);
            return;
        }
    });
};

User.mdlViewTeacherProfile = (req, result) => {
    sql.query("select t1.*,t2.name,t2.profile_pic,t2.country from tbl_viewed_profile t1 \n\
                join tbl_user t2 on t1.student_id = t2.user_id where teacher_id = ? ORDER by t1.created_at DESC", req.body.user_id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
//                        console.log(res);
            result(null, res);
            return;
        }
    });
};

User.mdlUpdateUserLocation = (req, result) => {
    updateData = {};

    if (req.body.user_longitude) {
        updateData.user_longitude = req.body.user_longitude;
    }

    if (req.body.user_latitude) {
        updateData.user_latitude = req.body.user_latitude;
    }

    if (req.body.time_zone) {
        updateData.time_zone = req.body.time_zone;
    }

    sql.query("UPDATE tbl_user SET ? WHERE user_id = ?", [updateData, req.body.user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            sql.query("SELECT * FROM tbl_user WHERE user_id = ?", [req.body.user_id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {
                    result(null, res);
                    return;
                }
            });
        }
    });
};

User.mdlGetMyProfile = (req, result) => {
    sql.query("SELECT * FROM tbl_user WHERE user_id = ?", [req.body.other_user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            sql.query("select * from tbl_user_image where user_id = ?", [req.body.other_user_id], (err, otherImages) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {
                    res['other_images'] = otherImages;
                    sql.query("SELECT sum(hours) as total_hours from tbl_gig where teacher_id = ? and gig_status='2'", [req.body.other_user_id], (err, totalHours) => {
                        if (err) {
                            console.log("error: ", err);
                            result(null, err);
                            return;
                        } else {
                            res['total_hours'] = totalHours;
                            sql.query("SELECT COUNT(student_id) as total_student from tbl_gig where teacher_id = ? and gig_status='2' group by student_id", [req.body.other_user_id], (err, totalStudent) => {
                                if (err) {
                                    console.log("error: ", err);
                                    result(null, err);
                                    return;
                                } else {
                                    res['total_student'] = totalStudent;
                                    sql.query("SELECT avg(review_rate) as review_rate from tbl_review where review_to = ?", [req.body.other_user_id], (err, reviewRate) => {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(null, err);
                                            return;
                                        } else {
                                            res['review_rate'] = reviewRate;
                                            sql.query("Select gig_id from tbl_gig where student_id = ? and teacher_id = ? and (gig_status='3' or gig_status='7' or gig_status='9')", [req.body.user_id, req.body.other_user_id], (err, isOrderRunning) => {
                                                if (err) {
                                                    console.log("error: ", err);
                                                    result(null, err);
                                                    return;
                                                } else {
                                                    res['is_order_running'] = isOrderRunning;
                                                    sql.query("Select count(distinct(student_id)) as total_gig from tbl_gig where student_id = ? and teacher_id = ? and gig_status = 2", [req.body.user_id, req.body.other_user_id], (err, totalGig) => {
                                                        if (err) {
                                                            console.log("error: ", err);
                                                            result(null, err);
                                                            return;
                                                        } else {
                                                            res['total_gig'] = totalGig;
                                                            result(null, res);
                                                            return;
                                                        }
                                                    });
                                                }
                                            });

                                        }
                                    });
                                }
                            });
                        }
                    });

                }
            });
        }
    });
};

User.mdlGetStudentsCount = (req, result) => {
    sql.query("SELECT a1.user_id,t3.country_latitude,t3.country_longitude,count(a2.user_id),a1.country from tbl_user a1 \n\
                        join tbl_token a2 on a1.user_id = a2.user_id \n\
                        JOIN tbl_price t3 on t3.country_name = a1.country \n\
                        where a1.user_id = a2.user_id and a2.app_role = 1 and last_seen > DATE_SUB(CURDATE(), INTERVAL 1 DAY) group by a1.country", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            result(null, res);
            return;
        }
    });
};

User.mdlListBookedLession = (req, result) => {
    var user_id = parseInt(req.body.user_id);
    if (parseInt(req.body.is_student)) {
        sql.query("select t2.gig_id,DATE_FORMAT(t2.gig_date,'%Y-%m-%d %H:%i:%s') as gig_date,t3.name as teacher_name, t3.profile_pic from tbl_booked_lession t1 \n\
                      left JOIN tbl_gig t2 on t1.gig_id = t2.gig_id \n\
                      left JOIN tbl_user t3 on t1.teacher_id = t3.user_id \n\
                      WHERE t1.student_id = ? and t1.status = 0 \n\
                      ORDER BY t1.id DESC", [user_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
                sql.query("SELECT count(gig_id) as running_order from tbl_gig where teacher_id != Null and ((??=?)  and (?? = ? or ?? = ? or ?? = ? or ?? = ?))",
                        ['student_id', user_id, 'gig_status', 0, 'gig_status', 3, 'gig_status', 7, 'gig_status', 9], (err, orderInfo) => {
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
            }
        });
    } else {
        sql.query("select t2.gig_id,DATE_FORMAT(t2.gig_date,'%Y-%m-%dT%H:%i:%s.000Z') as gig_date, t2.student_id, t3.name as student_name, t3.profile_pic, t4.subject_name, t2.price, t2.subject_id, t2.gig_status, t3.whatsapp_number from tbl_booked_lession t1 \n\
                      JOIN tbl_gig t2 on t1.student_id = t2.student_id and t1.gig_id = t2.gig_id \n\
                      JOIN tbl_user t3 on t1.student_id = t3.user_id \n\
                      join tbl_subject t4 on t2.subject_id = t4.subject_id \n\
                      WHERE t1.teacher_id = ? and t2.teacher_id IS NULL and t1.status = 0 \n\
                      ORDER BY t1.id DESC", [user_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {

                sql.query("SELECT count(gig_id) as running_order from tbl_gig where ((??=?)  and (?? = ? or ?? = ? or ?? = ? or ?? = ?))",
                        ['teacher_id', user_id, 'gig_status', 0, 'gig_status', 3, 'gig_status', 7, 'gig_status', 9], (err, orderInfo) => {
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

            }
        });
    }

};

User.mdlGetOnlineStatus = (req, result) => {
    sql.query("SELECT is_online,time_zone,DATE_FORMAT(last_seen,'%Y-%m-%d %H:%i:%s') as last_seen,verify_me,gender,profile_pic,paypal_id,IFNULL((select COUNT(image_id) from tbl_user_image WHERE user_id = tbl_user.user_id),0)as image_count FROM tbl_user where user_id = ?", [req.body.user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            result(null, res);
            return;
        }
    });
};

User.mdlGetMyOrders = (req, result) => {

    var page_no = parseInt(req.body.page_no === undefined ? '1' : req.body.page_no);
    var limit = 10;
    var offset = (page_no * limit) - limit;

    if (parseInt(req.body.app_role) === 1) {
        sql.query("SELECT t1.gig_id,t1.gig_status,t2.name,t2.profile_pic,t1.gig_date,t1.student_id,t1.teacher_id,t2.socket_id,t2.last_seen,t2.time_zone \n\
                    FROM tbl_gig t1 \n\
                    join tbl_user t2 on t1.teacher_id = t2.user_id \n\
                    WHERE t1.student_id = ?  ORDER BY t1.gig_id desc limit ? offset ?", [req.body.user_id, limit, offset], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
//                        console.log(res);
                result(null, res);
                return;
            }
        });
    } else {
        sql.query("SELECT t1.gig_id,t1.gig_status,t2.name,t2.profile_pic,t1.gig_date,t1.student_id,t1.teacher_id,t2.socket_id,t2.last_seen,t2.time_zone \n\
                    FROM tbl_gig t1 \n\
                    join tbl_user t2 on t1.student_id = t2.user_id \n\
                    WHERE t1.teacher_id = ?  ORDER BY t1.gig_id desc limit ? offset ?", [req.body.user_id, limit, offset], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
//                        console.log(res);
                result(null, res);
                return;
            }
        });
    }


};

User.mdlGetOrderDetail = (req, result) => {

    var gig_id = req.body.gig_id;

    sql.query("select t1.*,DATE_FORMAT(t1.gig_accepted_date,'%Y-%m-%d %H:%i:%s') as gig_accepted_date,DATE_FORMAT(t1.gig_delivered_date,'%Y-%m-%d %H:%i:%s') as gig_delivered_date,t2.review_text,t2.review_rate,(select time_zone from tbl_user where user_id = t1.teacher_id)as teacher_timezone,\n\
             (select time_zone from tbl_user where user_id = t1.student_id)as student_timezon from tbl_gig as t1 \n\
              left join tbl_review as t2 on t1.gig_id = t2.gig_id where t1.gig_id = ?\n\
             order by t1.gig_id desc,t2.review_id desc limit 1", [gig_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
//            console.log("order detail: ", res);
            result(null, res);
            return;
        }
    });
};

User.mdlGigStatusUpdate = (req, authData, result) => {
    updateData = {};
    updateData.gig_status = req.body.gig_status;

    if (parseInt(req.body.gig_status) === 3) {
        updateData.gig_accepted_date = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    }

    if (parseInt(req.body.gig_status) === 7 || req.body.teacher_delivery_text) {
        updateData.teacher_delivery_text = encodeURI(req.body.teacher_delivery_text);
        updateData.gig_delivered_date = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    }

    if (parseInt(req.body.gig_status) === 9) {
        sql.query("UPDATE tbl_gig set is_dispute = is_dispute+1 WHERE gig_id = ?", [req.body.gig_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                return;
            } else {
                return;
            }
        });
    }

    if (parseInt(req.body.gig_status) === 2) {

        stripe.charges.capture(
                req.body.stripe_charge_id,
                function (err, charge) {
                    if (err) {
                        console.log("error: ", err);

                        return;
                    } else {

                        sql.query("select stripe_customer_id from tbl_user where user_id = ?", [req.body.other_user_id], (err, teacherStripeID) => {
                            if (err) {
                                console.log("error: ", err);

                                return;
                            } else {
                                console.log("Customer Info: ", teacherStripeID);
                                stripe.customers.retrieve(teacherStripeID[0].stripe_customer_id,
                                        function (err, customer) {
                                            if (err) {
                                                console.log("error: ", err);

                                                return;
                                            } else {
                                                stripe.payouts.create(
                                                        {amount: req.body.price * 100,
                                                            currency: 'USD',
                                                            destination: customer.default_source
                                                        },
                                                        function (err, payout) {
                                                            if (err) {
                                                                console.log("error: ", err);

                                                                return;
                                                            } else {
                                                                console.log(payout);
                                                                reviewData = {
                                                                    review_from: req.body.user_id,
                                                                    review_to: req.body.review_to,
                                                                    review_date: req.body.review_date,
                                                                    review_text: encodeURI(req.body.review_text),
                                                                    review_rate: req.body.review_rate,
                                                                    gig_id: req.body.gig_id
                                                                };
                                                                sql.query("INSERT INTO tbl_review SET ?", reviewData, (err, res) => {
                                                                    if (err) {
                                                                        console.log("error: ", err);

                                                                        return;
                                                                    } else {
                                                                        pishInfo = {};
                                                                        var msg = "You have received a review from " + authData.name;
                                                                        var type = 'PUSH_REVIEW';

                                                                        pishInfo.notification = {
                                                                            title: authData.name,
                                                                            body: msg
                                                                        };

                                                                        pishInfo.data = {
                                                                            title: authData.name,
                                                                            text: msg,
                                                                            type: type
                                                                        };
                                                                        sendPush.teacherNotification(req.body.other_user_id, pishInfo);
                                                                        return;
                                                                    }
                                                                });
                                                            }
                                                        }
                                                );
                                            }
                                        }
                                );

                            }
                        });

                    }
                }
        );

    }


    sql.query("UPDATE tbl_gig SET ? WHERE gig_id = ?", [updateData, req.body.gig_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            sql.query("SELECT * FROM tbl_gig WHERE gig_id = ?", [req.body.gig_id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {

                    try {
                        io.sockets.connected[users[req.body.other_user_id]].emit('gig_status_update', {status_code: 1});
                    } catch (e) {
                        console.log(e);
                    }

                    if (parseInt(req.body.gig_status) === 7) {
                        pishInfo = {};
                        var msg = authData.name + " has completed the lesson.";
                        pishInfo.notification = {
                            title: authData.name,
                            body: msg
                        };

                        pishInfo.data = {
                            title: authData.name,
                            text: msg,
                            type: 'PUSH_DELIVERED'
                        };
                        sendPush.studentNotification(req.body.other_user_id, pishInfo);

                    }

                    if (parseInt(req.body.gig_status) === 2 || parseInt(req.body.gig_status) === 9) {
                        pishInfo = {};
                        var msg = authData.name + " has marked your order completed.";
                        var type = 'PUSH_COMPLETED';
                        if (parseInt(req.body.gig_status) === 9) {
                            var msg = authData.name + " has disputed your lesson.";
                            var type = 'PUSH_DISPUTED';
                        }

                        pishInfo.notification = {
                            title: authData.name,
                            body: msg
                        };

                        pishInfo.data = {
                            title: authData.name,
                            text: msg,
                            type: type
                        };
                        sendPush.teacherNotification(req.body.other_user_id, pishInfo);

                    }


                    result(null, res);
                    return;
                }
            });
        }
    });


};

User.mdlgetTeachersCount = (user_id, offset, limit, latitude, longitude, radius, where3, group, filter_flag, where_gender, order_by, result) => {

    sql.query("select t1.age,t1.user_id,t1.name,t1.user_latitude,t1.user_longitude,t1.country,t1.socket_id,t1.profile_pic, \n\
                                  (select count(review_to) from tbl_review WHERE review_to = t1.user_id)as total_review, (select AVG(review_rate) from tbl_review WHERE review_to = t1.user_id)as avg_rating,\n\
                                  (6371 * acos(cos(radians(?)) * cos( radians(t1.user_latitude)) * cos(radians(t1.user_longitude) - radians(?)) + sin(radians(?)) * sin(radians(t1.user_latitude)))) as distance  \n\
                                  from tbl_user t1 \n\
                                  join tbl_token a2 on t1.user_id = a2.user_id \n\
                                  JOIN tbl_subjects_for_teacher t2 on t1.user_id = t2.user_id \n\
                                  WHERE " + filter_flag + " " + where_gender + " a2.app_role = 2 and t1.user_id != ? and t1.profile_pic != 'nourl' and t1.country != '' and t1.profile_pic != '' and t1.user_latitude != '0.000000' and user_longitude != '0.000000' and " + where3 + " " + group + "  " + radius + " " + order_by + " LIMIT ? OFFSET ?", [latitude, longitude, latitude, user_id, limit, offset], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            sql.query("select count(t1.user_id) as total_teachers,count(DISTINCT(t1.country)) as total_country \n\
                                  from tbl_user t1 \n\
                                  join tbl_token a2 on t1.user_id = a2.user_id \n\
                                  WHERE a2.app_role = 2 and t1.user_id != ? and t1.profile_pic != 'nourl' and t1.country != '' and t1.profile_pic != '' and t1.user_latitude != '0.000000' and user_longitude != '0.000000'", [user_id], (err, totalTeacherCount) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {
                    res['total_teacher_count'] = totalTeacherCount;
                    result(null, res);
                    return;
                }
            });
        }
    });


};

User.mdlListReviews = (req, result) => {

    sql.query("select t1.*,t2.name,t2.profile_pic from tbl_review as t1 join tbl_user as t2 on t1.review_from = t2.user_id where review_to = ?", [req.body.other_user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            result(null, res);
            return;
        }
    });


};

User.mdlCreateLessonRequest = (req, io, result) => {


    var info = {
        student_id: req.body.user_id,
        price: req.body.price,
        subject_id: req.body.subject_id,
        gig_status: req.body.gig_status,
        stripe_charge_id: req.body.stripe_charge_id,
        hours: req.body.hours,
        gig_date: req.body.gig_date
    };

    sql.query("INSERT INTO tbl_gig SET ?", info, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            var gig_id = res.insertId;

            var book_info = {
                student_id: req.body.user_id,
                teacher_id: req.body.teacher_id,
                gig_id: gig_id,
                status: 0,
                created_at: moment.utc().format("YYYY-MM-DD HH:mm:ss")
            };

            sql.query("INSERT INTO tbl_booked_lession SET ?", book_info, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {

                    try {
                        io.sockets.connected[users[req.body.teacher_id]].emit('new_lesson', {status_code: 1, message: 'Success', gig_data: {gig_id: res.insertId, ...info}, en: 'new_lesson'});
                    } catch (e) {
                        console.log(e);

                    }

                    var mailOptions = {
                        from: 'zanyscs@gmail.com',
                        to: 'ashish.eih@gmail.com',
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

//                    pishInfo = {};
//                    pishInfo.notification = {
//                        title: 'Zanys',
//                        body: 'You have a new lesson request.'
//                    };
//
//                    pishInfo.data = {
//                        title: 'Zanys',
//                        text: 'You have a new lesson request.',
//                        type: 1
//                    };
//
//
//                    sendPush.teacherNotification(req.body.teacher_id, pishInfo);

                    result(null, {gig_id: gig_id, ...info});
                    return;
                }
            });
        }
    });


};

User.mdlRequestStatusUpdate = (req, io, authData, result) => {
    var request_status = parseInt(req.body.request_status);
    if (request_status === 1) {
        updateData = {
            status: req.body.request_status
        };
        sql.query("UPDATE tbl_booked_lession SET ? WHERE gig_id = ?", [updateData, req.body.gig_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {
                var current_time = new Date(new Date().toUTCString());
                updateGigData = {
                    teacher_id: req.body.user_id,
                    gig_status: 3,
                    gig_accepted_date: current_time,
                    intro_msg: req.body.intro_msg
                };
                sql.query("UPDATE tbl_gig SET ? WHERE gig_id = ?", [updateGigData, req.body.gig_id], (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {

                        var data = {
                            teacher_id: req.body.user_id,
                            teacher_name: authData.name,
                            gig_status: 3,
                            gig_id: req.body.gig_id
                        };
                        try {
                            io.sockets.connected[users[req.body.student_id]].emit('teacher_accepted_subject', {status_code: 1, teacher_data: data});
                        } catch (e) {
                            console.log(e);
                        }
                        result(null, res);
                        return;
                    }
                });
            }
        });
    } else {
        updateData = {
            status: req.body.request_status
        };
        sql.query("UPDATE tbl_booked_lession SET ? WHERE gig_id = ?", [updateData, req.body.gig_id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            } else {

                var data = {
                    teacher_id: req.body.teacher_id,
                    teacher_name: authData.name,
                    teacher_profile: authData.profile_pic,
                    status: req.body.request_status,
                    gig_id: req.body.gig_id
                };


                try {
                    io.sockets.connected[users[req.body.student_id]].emit('teacher_rejected_subject', {status_code: 1, teacher_data: data});
                } catch (e) {
                    console.log(e);
                }

                result(null, res);
                return;

            }
        });
    }
};

User.mdlCheckFirstOrder = (req, result) => {
    var teacher_id = req.body.teacher_id;
    var student_id = req.body.student_id;
    sql.query("SELECT COUNT(t1.gig_id) as total_order from tbl_gig as t1 \n\
       where ((??=? and ??=?))  and (??=?)", ['t1.teacher_id', teacher_id, 't1.student_id', student_id, 't1.gig_status', 2], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            result(null, res);
            return;
        }
    });

};

User.mdlBlock = (req, result) => {
    var user_id = req.body.user_id;
    var block_to = req.body.block_to;
    var block_date = req.body.block_date;

    blockObj = {
        'block_by': user_id,
        'block_to': block_to,
        'block_date': block_date
    };

    sql.query("SELECT * from tbl_user_block WHERE block_by = ? and block_to = ?", [user_id, block_to], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {
            if (res.length > 0) {
                sql.query("DELETE FROM tbl_user_block WHERE block_by = ? and block_to = ?", [user_id, block_to], (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                    } else {
                        result(null, res);
                    }
                });
            } else {
                sql.query("INSERT INTO tbl_user_block SET ?", blockObj, (err, res) => {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    } else {
                        result(null, {id: res.insertId, ...blockObj});
                        return;
                    }
                });
            }
        }
    });

};

User.mdlAddReport = (req, result) => {
    var user_id = req.body.user_id;
    var reported_to = req.body.reported_to;
    var repoted_item_id = req.body.repoted_item_id;
    var report_type = req.body.report_type;
    var reported_date = req.body.reported_date;

    reportObj = {
        'report_by': user_id,
        'reported_to': reported_to,
        'repoted_item_id': repoted_item_id,
        'report_type': report_type,
        'reported_date': reported_date
    };

    sql.query("INSERT INTO tbl_report SET ?", reportObj, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            result(null, {id: res.insertId, ...reportObj});
            return;
        }
    });

};

User.mdlStudentSeen = (req, result) => {
    var user_id = req.body.user_id;
    var teacher_id = req.body.teacher_id;
    var seen_time = req.body.seen_time;


    reportObj = {
        teacher_id: teacher_id,
        student_id: user_id,
        created_at: seen_time
    };

    sql.query("INSERT INTO tbl_viewed_profile SET ?", reportObj, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {


            try {
                io.sockets.connected[users[teacher_id]].emit('student_seen', {status_code: 1, info: reportObj, message: 'Success'});
            } catch (e) {
                console.log(e);
            }


            result(null, {id: res.insertId, ...reportObj});
            return;
        }
    });

};

User.mdlUploadDisputeScreenshot = (req, result) => {
    var user_id = req.body.user_id;
    var gig_id = req.body.gig_id;

    updateData = {};

    if (req.file) {
        dispute_ss = req.file.filename;
        updateData.dispute_screenshot = 'uploads/' + dispute_ss;
    }

    sql.query("UPDATE tbl_gig SET ? WHERE gig_id = ?", [updateData, gig_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            sql.query("SELECT * FROM tbl_gig WHERE gig_id = ?", [req.body.gig_id], (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(null, err);
                    return;
                } else {
                    result(null, res);
                    return;
                }
            });
        }
    });

};

User.mdlDeleteUserImage = (req, result) => {
    var user_id = req.body.user_id;
    var image_id = req.body.image_id;

    sql.query("DELETE FROM tbl_user_image WHERE image_id = ? and user_id = ?", [image_id, user_id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        } else {
            try {
                fs.unlinkSync(req.body.imagename);
                console.log('successfully deleted /tmp/hello');
                result(null, res);
                return;
            } catch (err) {
                // handle the error
                console.log("error: ", err);
            }

        }
    });

};

User.mdlCronLessonRequest = (req, result) => {

    for (i = 1; i < 13; i++) {
        var diff_sec = 150;
        sql.query("SELECT *,DATE_FORMAT(created_at,'%Y-%m-%d %H:%i:%s') as created_at FROM tbl_booked_lession WHERE status = 0 order by id desc", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                res.forEach(lessons => {

                    var endTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");

                    var date1 = new Date(lessons['created_at']);
                    var date2 = new Date(endTime);

                    diff_t = parseInt((date2 - date1) / (1000));
                    if (diff_t >= diff_sec) {
                        sql.query("UPDATE tbl_booked_lession set status = 2 WHERE gig_id = ?", [lessons['gig_id']], (err, res) => {
                            if (err) {
                                console.log(err);
                            } else {
                                sql.query("UPDATE tbl_gig set gig_status =8,is_cron_run=1 WHERE gig_id = ?", [lessons['gig_id']], (err, res) => {
                                    if (err) {
                                        console.log(err);
                                        result(null, err);
                                        return;
                                    } else {
                                        try {
                                            io.sockets.connected[users[lessons['student_id']]].emit('cron_reject', {status_code: 1, gig_data: lessons});
                                            io.sockets.connected[users[lessons['teacher_id']]].emit('cron_reject', {status_code: 1, gig_data: lessons});
                                        } catch (e) {
                                            console.log(e);
                                        }
                                    }
                                });
                            }
                        });

                    }
                });
            }
        });
    }

    result(null, 'OK');
    return;


};

User.mdlCronForOrderCancelTeacher = (req, result) => {

    for (i = 1; i < 13; i++) {
        var diff_sec = 86400;
        sql.query("SELECT *,DATE_FORMAT(gig_accepted_date,'%Y-%m-%d %H:%i:%s') as gig_accepted_date FROM tbl_gig WHERE gig_status = 3 and is_cron_run = 0 order by gig_id desc", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                res.forEach(lessons => {

                    var endTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");

                    var date1 = new Date(lessons['gig_accepted_date']);
                    var date2 = new Date(endTime);

                    diff_t = parseInt((date2 - date1) / (1000));
                    if (diff_t >= diff_sec) {

                        sql.query("UPDATE tbl_gig set gig_status =8,is_cron_run=1 WHERE gig_id = ?", [lessons['gig_id']], (err, res) => {
                            if (err) {
                                console.log(err);
                                result(null, err);
                                return;
                            }
                        });

                    }
                });
            }
        });
    }

    result(null, 'OK');
    return;


};

User.mdlCronForOrderCompleteStudent = (req, result) => {

    for (i = 1; i < 13; i++) {
        var diff_sec = 86400;
        sql.query("SELECT *,DATE_FORMAT(gig_delivered_date,'%Y-%m-%d %H:%i:%s') as gig_delivered_date  FROM tbl_gig WHERE gig_status = 7 and is_cron_run = 0 order by gig_id desc", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                res.forEach(lessons => {

                    var endTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");

                    var date1 = new Date(lessons['gig_delivered_date']);
                    var date2 = new Date(endTime);

                    diff_t = parseInt((date2 - date1) / (1000));
                    if (diff_t >= diff_sec) {

                        sql.query("UPDATE tbl_gig set gig_status =2,is_cron_run=1 WHERE gig_id = ?", [lessons['gig_id']], (err, res) => {
                            if (err) {
                                console.log(err);
                                result(null, err);
                                return;
                            }
                        });

                    }
                });
            }
        });
    }

    result(null, 'OK');
    return;


};

module.exports = User;