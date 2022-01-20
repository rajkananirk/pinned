const User = require("../models/user.model.js");
const Auth = require("../models/auth.model.js");
const {check, validationResult} = require('express-validator');


//user
exports.create = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    if (req.body.email !== '') {
        var Arrwhere = {email: req.body.email, thirdparty_id: req.body.thirdparty_id};

        User.findExits(Arrwhere, (err, data) => {

            if (err) {
                res.send(err);
            } else {

                if (data) {

                    res.send({
                        msg: "Email has already been taken.",
                        status_code: 10
                    });
                } else {

                    if (req.file) {
                        profile_pic = req.file.filename;
                        profile_pic = '/home/ubuntu/zanys_api/uploads/' + profile_pic;
                    } else {
                        profile_pic = '';
                    }


                    var user_info = {
                        email: req.body.email,
                        thirdparty_id: req.body.thirdparty_id,
                        socket_id: req.body.socket_id,
                        profile_pic: profile_pic,
                        name: req.body.name,
                        gender: req.body.gender,
                        role: req.body.role,
                        country: req.body.country,
                        login_type: req.body.login_type,
                        user_latitude: req.body.user_latitude,
                        user_longitude: req.body.user_longitude,
                        time_zone: req.body.time_zone
                    };

                    // Save Subject in the database
                    User.create(user_info, (err, data) => {
                        if (err) {
                            res.sendStatus(200).send(err);
                        } else {
                            data.msg = 'login successful.';
                            data.status_code = 1;

                            user_token = makeid(10);

                            tokenObj = {
                                device_token: req.body.device_token,
                                device_type: req.body.device_type,
                                user_token: user_token,
                                device_id: req.body.device_id,
                                user_id: data.user_id,
                                app_role: req.body.app_role
                            };

                            User.manage_token(tokenObj, (err, tokenData) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    data.user_token = user_token;
                                    res.send(data);
                                }
                            });
                        }
                    });
                }

            }
        });
    }

};

exports.logout = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    ObjInfo = {
        user_id: req.body.user_id,
        user_token: req.body.user_token,
        app_role: req.body.app_role,
        device_id: req.body.device_id
    };

    Auth.findById(ObjInfo, (err, authData) => {
        if (err) {
            res.send(err);
        } else {

            if (authData.isData) {

                User.logoutData(ObjInfo, (err, result) => {
                    if (err) {

                        res.send(err);
                    } else {

                        res.send({
                            msg: 'Logout successfully.',
                            status_code: 1
                        });
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

exports.updateProfile = (req, res) => {
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

                User.mdlUpdateProfile(req, (err, profileData) => {
                    if (err) {
                        res.send(err);
                    } else {

                        resProfileData = {};
                        resProfileData.info = profileData[0];
                        resProfileData.msg = 'Profile updated successfully.';
                        resProfileData.status_code = 1;
                        res.send(resProfileData);
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

exports.updateUserImages = (req, res) => {
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

                User.mdlupdateUserImages(req, (err, profileData) => {
                    if (err) {

                        res.send(err);
                    } else {

                        res.send({
                            msg: 'Images Upload Successfully.',
                            status_code: 1
                        });

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

exports.updateTeachereSubjects = (req, res) => {
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

                User.mdlUpdateTeachereSubjects(req, (err, teachereSubjectsData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resTeachereSubjectsData = {};
                        resTeachereSubjectsData.info = teachereSubjectsData;
                        resTeachereSubjectsData.msg = 'Update teacher subjects successfully.';
                        resTeachereSubjectsData.status_code = 1;
//                        console.log(resTeachereSubjectsData);
                        res.send(resTeachereSubjectsData);
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

exports.getTeacherSubject = (req, res) => {
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

                User.mdlGetTeacherSubject(req, (err, teacherSubjectData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resTeacherSubjectData = {};
                        resTeacherSubjectData.info = teacherSubjectData
                        resTeacherSubjectData.msg = 'Get subjects Successfully.';
                        resTeacherSubjectData.status = 1;
                        res.send(resTeacherSubjectData);
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

exports.getAllSubject = (req, res) => {
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

                User.mdlgetAllSubject(req, (err, allSubjectData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resGetAllSubjectData = {};
                        resGetAllSubjectData.info = allSubjectData
                        resGetAllSubjectData.msg = 'Get all subjects Successfully.';
                        resGetAllSubjectData.status = 1;
                        res.send(resGetAllSubjectData);
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

exports.viewTeacherProfile = (req, res) => {
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

                User.mdlViewTeacherProfile(req, (err, teacherProfileData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resTeacherProfileData = {};
                        resTeacherProfileData.info = teacherProfileData
                        resTeacherProfileData.msg = 'Get Teacher Viewer Successfully.';
                        resTeacherProfileData.status = 1;
                        res.send(resTeacherProfileData);
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

exports.updateUserLocation = (req, res) => {
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

                User.mdlUpdateUserLocation(req, (err, userLocationData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resUserLocationData = {};
                        resUserLocationData.info = userLocationData;
                        resUserLocationData.msg = 'Profile updated successfully..';
                        resUserLocationData.status_code = 1;
                        res.send(resUserLocationData);
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

exports.getMyProfile = (req, res) => {
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

                User.mdlGetMyProfile(req, (err, myProfileData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resMyProfileData = {};
                        resMyProfileData.info = myProfileData[0];
                        resMyProfileData.other_images = myProfileData['other_images'];
                        resMyProfileData.total_hours = myProfileData['total_hours'];
                        resMyProfileData.review_rate = myProfileData['review_rate'];
                        resMyProfileData.is_order_running = myProfileData['is_order_running'];
                        resMyProfileData.total_gig = myProfileData['total_gig'];
                        resMyProfileData.msg = 'Get profile data successfully..';
                        resMyProfileData.status_code = 1;
                        res.send(resMyProfileData);
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

exports.getStudentsCount = (req, res) => {
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

                User.mdlGetStudentsCount(req, (err, StudentsCountData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resStudentsCountData = {};
                        resStudentsCountData.info = StudentsCountData;
                        resStudentsCountData.msg = 'Get data successfully.';
                        resStudentsCountData.status_code = 1;
                        res.send(resStudentsCountData);
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

exports.listBookedLession = (req, res) => {
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

                User.mdlListBookedLession(req, (err, bookedLessionData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resBookedLessionData = {};
                        resBookedLessionData.info = bookedLessionData;
                        resBookedLessionData.total_orders = bookedLessionData['order_info'];
                        resBookedLessionData.msg = 'Get data successfully.';
                        resBookedLessionData.status_code = 1;
                        res.send(resBookedLessionData);
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

exports.getOnlineStatus = (req, res) => {
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

                User.mdlGetOnlineStatus(req, (err, onlineStatusData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resOnlineStatusData = {};
                        resOnlineStatusData.info = onlineStatusData;
                        resOnlineStatusData.msg = 'Get data successfully.';
                        resOnlineStatusData.status_code = 1;
                        res.send(resOnlineStatusData);
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

exports.getMyOrders = (req, res) => {
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

                User.mdlGetMyOrders(req, (err, myOrdersData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resMyOrdersData = {};
                        resMyOrdersData.info = myOrdersData;
                        resMyOrdersData.msg = 'Get data successfully.';
                        resMyOrdersData.status_code = 1;
                        res.send(resMyOrdersData);
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

exports.getOrderDetail = (req, res) => {
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

                User.mdlGetOrderDetail(req, (err, orderDetailData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resOrderDetailData = {};
                        resOrderDetailData.info = orderDetailData;
                        resOrderDetailData.msg = 'Get data successfully.';
                        resOrderDetailData.status_code = 1;
                        res.send(resOrderDetailData);
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

exports.gigStatusUpdate = (req, res) => {
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

                User.mdlGigStatusUpdate(req, authData, (err, gigStatusData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resGigStatusData = {};
                        resGigStatusData.info = gigStatusData;
                        resGigStatusData.msg = 'Get data successfully.';
                        resGigStatusData.status_code = 1;
                        res.send(resGigStatusData);
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

exports.getTeachersCount = (req, res) => {
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

                var subject_id = req.body.subject_id;
                var user_id = req.body.user_id;
                var page_no = 1;//data.page_no;
                var latitude = req.body.latitude;
                var longitude = req.body.longitude;
                var flag = req.body.flag;
                var filter_flag = req.body.filter_flag;
                var gender_flag = req.body.gender_flag;
                var limit = 20;
                var order_by = " order by distance asc ";

                var radius = "having distance < 100";
                var group = "group by t1.user_id";
                if (flag <= 3) {
                    radius = '';
//                                group = 'group by t1.country';
                    order_by = ' order by rand() ';
                } else if (flag > 3 && flag <= 3.5) {
                    limit = 10;
                    var radius = "having distance < 1500";
                } else if (flag > 3.5 && flag <= 4) {
                    limit = 10;
                    var radius = "having distance < 1500";
                } else if (flag > 4 && flag <= 5) {
                    limit = 20;
                    var radius = "having distance < 1000";
                } else if (flag > 5 && flag <= 6) {
                    limit = 20;
                    var radius = "having distance < 800";
                } else if (flag > 6 && flag <= 7) {
                    limit = 20;
                    var radius = "having distance < 900";
                } else if (flag > 7 && flag <= 8) {
                    limit = 20;
                    var radius = "having distance < 500";
                } else if (flag > 8 && flag <= 9) {
//                                limit = 20;
                    var radius = "having distance < 300";
                } else if (flag > 9) {
//                                limit = 20;
                    var radius = "having distance < 200";
                }

                var where_filter = "t1.last_seen >= DATE(NOW()) - INTERVAL 89 DAY and ";
                if (filter_flag == 1) {
                    where_filter = "t1.last_seen >= DATE(NOW()) - INTERVAL 1 DAY and";
                } else if (filter_flag == 2) {
                    where_filter = "t1.last_seen >= DATE(NOW()) - INTERVAL 7 DAY and";
                } else if (filter_flag == 3) {
                    where_filter = "t1.last_seen >= DATE(NOW()) - INTERVAL 30 DAY and";
                } else if (filter_flag == 4) {
                    where_filter = " t1.last_seen >= DATE(NOW()) - INTERVAL 89 DAY and  t1.socket_id !='' and ";
                } else if (filter_flag == 5) {
                    where_filter = " t1.last_seen >= DATE(NOW()) - INTERVAL 89 DAY and  t1.gender = 1 and ";
                } else if (filter_flag == 6) {
                    where_filter = " t1.last_seen >= DATE(NOW()) - INTERVAL 89 DAY and  t1.gender = 2 and ";
                }

                var where_gender = " 1 = 1 and ";
                if (gender_flag == 5) {
                    where_gender = " t1.gender = 1 and ";
                } else if (gender_flag == 6) {
                    where_gender = " t1.gender = 2 and ";
                }

//                            var where3 = "1=1";
                if (subject_id != 0) {
                    where3 = "t2.subject_id = " + subject_id;
                } else {
                    where3 = "1=1";
                }

                var offset = '';
                page_no = page_no - 1;
                offset = (limit * page_no);

                User.mdlgetTeachersCount(user_id, offset, limit, latitude, longitude, radius, where3, group, where_filter, where_gender, order_by, (err, teachersCountData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resTeachersCountData = {};
                        resTeachersCountData.info = teachersCountData;
                        resTeachersCountData.total_teacher_count = teachersCountData['total_teacher_count'];
                        resTeachersCountData.msg = 'Get data successfully.';
                        resTeachersCountData.status_code = 1;
                        res.send(resTeachersCountData);
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

exports.listReviews = (req, res) => {
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

                User.mdlListReviews(req, (err, reviewsData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resReviewsData = {};
                        resReviewsData.info = reviewsData;
                        resReviewsData.msg = 'Get data successfully.';
                        resReviewsData.status_code = 1;
                        res.send(resReviewsData);
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

exports.createLessonRequest = (req, res) => {
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
                User.mdlCreateLessonRequest(req, io, (err, lessonRequestData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resLessonRequestData = {};
                        resLessonRequestData.info = lessonRequestData;
                        resLessonRequestData.msg = 'Get data successfully.';
                        resLessonRequestData.status_code = 1;
                        res.send(resLessonRequestData);
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

exports.requestStatusUpdate = (req, res) => {
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
                User.mdlRequestStatusUpdate(req, io, authData, (err, requestStatusData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resRequestStatusData = {};
                        resRequestStatusData.info = requestStatusData;
                        resRequestStatusData.msg = 'Get data successfully.';
                        resRequestStatusData.status_code = 1;
                        res.send(resRequestStatusData);
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

exports.checkFirstOrder = (req, res) => {
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

                User.mdlCheckFirstOrder(req, (err, firstOrderData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resFirstOrderData = {};
                        resFirstOrderData.info = firstOrderData;
                        resFirstOrderData.msg = 'Get data successfully.';
                        resFirstOrderData.status_code = 1;
                        res.send(resFirstOrderData);
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

exports.block = (req, res) => {
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

                User.mdlBlock(req, (err, blockData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resBlockData = {};
                        resBlockData.info = blockData;
                        resBlockData.msg = 'Get data successfully.';
                        resBlockData.status_code = 1;
                        res.send(resBlockData);
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

exports.addReport = (req, res) => {
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

                User.mdlAddReport(req, (err, reportData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resReportData = {};
                        resReportData.info = reportData;
                        resReportData.msg = 'Get data successfully.';
                        resReportData.status_code = 1;
                        res.send(resReportData);
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

exports.studentSeen = (req, res) => {
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

                User.mdlStudentSeen(req, (err, seenData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resSeenData = {};
                        resSeenData.info = seenData;
                        resSeenData.msg = 'Get data successfully.';
                        resSeenData.status_code = 1;
                        res.send(resSeenData);
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

exports.uploadDisputeScreenshot = (req, res) => {
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

                User.mdlUploadDisputeScreenshot(req, (err, disputeData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resDisputeData = {};
                        resDisputeData.info = disputeData;
                        resDisputeData.msg = 'Get data successfully.';
                        resDisputeData.status_code = 1;
                        res.send(resDisputeData);
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

exports.deleteUserImage = (req, res) => {
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

                User.mdlDeleteUserImage(req, (err, userImageData) => {
                    if (err) {
                        res.send(err);
                    } else {
                        resUserImageData = {};
                        resUserImageData.info = userImageData;
                        resUserImageData.msg = 'Get data successfully.';
                        resUserImageData.status_code = 1;
                        res.send(resUserImageData);
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

exports.cronForRejectLessonRequest = (req, res) => {
    User.mdlCronLessonRequest(req, (err, cronData) => {
        if (err) {
            console.log('cronForRejectLessonRequest Run Error');
            res.send(err);
        } else {
            console.log('Cron Run OK');
            res.send({
                msg: 'Unauthorised User.',
                status_code: 2
            });
        }
    });
};

exports.cronForOrderCancelTeacher = (req, res) => {
    User.mdlCronForOrderCancelTeacher(req, (err, cronData) => {
        if (err) {
            console.log('cronForOrderCancelTeacher Run Error');
            res.send(err);
        } else {
            console.log('Order Cancel Teacher Cron Run OK');
            res.send({
                msg: 'Unauthorised User.',
                status_code: 2
            });
        }
    });
};

exports.cronForOrderCompleteStudent = (req, res) => {
    User.mdlCronForOrderCompleteStudent(req, (err, cronData) => {
        if (err) {
            console.log('cronForOrderCompleteStudent Run Error');
            res.send(err);
        } else {
            console.log('Order Compelte Student Cron Run OK');
            res.send({
                msg: 'Unauthorised User.',
                status_code: 2
            });
        }
    });
};

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

