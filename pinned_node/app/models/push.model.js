const sql = require("./db.js");
const FCM = require('fcm-node');
const serverKey = 'AAAAF27o4-Q:APA91bHxyJ4CXPkyAUZvHLFHKixMH9_sRFDa0jtpTfBj-7kEaZzDQmFvdUKgwzBZYwMgX52Y5xEriopD0wXlYKuKmFyt0H39uu1pbkaj1EmjtcJhBGyNmXoay1QcRbt60S0irq_wORss'; //put your server key here
const serverKey2 = 'AAAAeObw1gQ:APA91bE8WEUKU5ROlBdy9n8FPlPx0gyIESRnqv0-0KnS0OPiynlSQl7Ps-YQa8o1iDk7JOymhNIVtN9TxS4L8Red8B0GBFgVPIjvA0rOhoPMYzkqib2arue6WcJlxqSB7oSDE-qmrjne'; //put your server key here
const fcm = new FCM(serverKey);
const fcm2 = new FCM(serverKey2);
// constructor
const sendPush = function (message) {};

sendPush.studentNotification = function (user_id, message) {

    var app_role = 1;
    sql.query("Select group_concat(t1.device_token) as token from tbl_token t1 \n\
                where ??=? and ?? = ? ", ['t1.user_id', user_id, 't1.app_role', 1], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {


            try {
                var tokens = res[0]['token'];
                if (tokens) {
                    var tokens = tokens.split(',');
                    message["registration_ids"] = tokens;
                }

            } catch (e) {

                console.log(e);
            }

            fcm.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong1!");
                    console.log(err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    });

};

sendPush.teacherNotification = function (user_id, message) {
    var app_role = 2;
    sql.query("Select group_concat(t1.device_token) as token from tbl_token t1 \n\
                where ??=? and ?? = ? ", ['t1.user_id', user_id, 't1.app_role', 2], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        } else {


            try {
                var tokens = res[0]['token'];
                if (tokens) {
                    var tokens = tokens.split(',');
                    message["registration_ids"] = tokens;
                }
            } catch (e) {

                console.log(e);
            }

            console.log(message);
            fcm2.send(message, function (err, response) {
                if (err) {
                    console.log("Something has gone wrong1!");
                    console.log(err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    });
};

module.exports = sendPush;