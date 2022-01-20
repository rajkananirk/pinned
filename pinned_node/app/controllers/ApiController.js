const User = require("../models/user.model.js");
const apiModel = require("../models/ApiModel.js");
const {check, validationResult} = require('express-validator');


//user
exports.get_user_by_username = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    console.log("get_user_by_username api call successfully");

    apiModel.getUserByUserName(req, (err, userData) => {
        if (err) {
            res.send(err);
        } else {

            resChatData = {};

            if (userData.status == 0) {

                resChatData.msg = userData.msg;
                resChatData.status = userData.status;
                res.send(resChatData);
            } else {

                resChatData.msg = userData.msg;
                resChatData.status = userData.status;
                resChatData.social_link = userData.social_link;
                resChatData.social_id = userData.social_id;
                resChatData.link = userData.link;
                resChatData.random_number = userData.random_number;
                res.send(resChatData);
            }

        }

    });


};


exports.sendEmitApi = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    apiModel.sendEmit(req, (err, userData) => {
        if (err) {
            res.send(err);
        } else {
            resChatData = {};
            resChatData.msg = "Emit Send Successfully.";
            resChatData.status = 1;
            res.send(resChatData);
        }

    });
};

exports.sendEmitContactApi = (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    apiModel.sendEmitContactApi(req, (err, userData) => {
        if (err) {
            res.send(err);
        } else {
            resChatData = {};
            resChatData.msg = "Emit Send Successfully.";
            resChatData.status = 1;
            res.send(resChatData);
        }

    });
};