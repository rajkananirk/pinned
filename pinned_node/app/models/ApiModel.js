const sql = require("./db.js");
const Base = require("./base.model.js");
const moment = require('moment');
const fs = require('fs');
const ApiModel = function (apiModel) {};

ApiModel.getUserByUserName = (req, result) => {

       username = req.body.name;
       random_number = Math.floor(100000 + Math.random() * 900000);
       console.log('યુઝર નામ ' + username);

       sql.query("SELECT * from users where username = ?", [username], (err, res) => {

              if (err) {
                     console.log("error: ", err);
                     result(err, null);
                     return;
              } else {

                     if (res.length > 0) {

                            sql.query("UPDATE users set total_airpawnd = total_airpawnd + 1 WHERE id = ", [res[0].id], (err2, res2) => {

                                   /*Send Updated Count emit Here*/
                                   try {
                                          emit_data = {};
                                          emit_data.user_id = res[0].id;
                                          emit_data.count = res[0].total_airpawnd;
                                          io.sockets.connected[res[0].socket_id].emit('updatecount', emit_data);
                                          console.log("Update count Emit Send Successfully");
                                   } catch (e) {
                                          console.log(e);
                                   }

                            });

                            if (res[0].is_link_active == 0) {

                                   console.log('Raj Kanani');
                                   data = {
                                          'status': 1,
                                          'msg': 'Get User View List Successfully',
                                          'social_link': "http://159.89.145.112/pinned/get_user" + username,
                                          'social_id': 0,
                                          'link': "http://159.89.145.112/pinned/get_user" + username,
                                          'random_number': random_number,
                                   }

                                   console.log('Data1->' + JSON.stringify(data));

                                   result(null, data);
                                   return;
                            } else {

                                   sql.query("select * from tbl_social_link t1 JOIN tbl_user_social_link t2 on t1.social_id = t2.social_id WHERE t2.user_id = ? AND t2.is_first = 1", [res[0].id], (err3, res3) => {

                                          if (err3) {
                                                 console.log("error: ", err);
                                                 result(err, null);
                                                 return;
                                          } else {
                                                 console.log('ડેટા ની લેંથ ' + res3.length);
                                                 console.log('યુઝર આઈડી  ' + res[0].id);

                                                 if (res3.length == 0) {

                                                        sql.query("select * from tbl_social_link t1 JOIN tbl_user_social_link t2 on t1.social_id = t2.social_id WHERE t2.user_id = ? LIMIT 1", [res[0].id], (err3, res5) => {

                                                               if (err3) {
                                                                      console.log("error: ", err);
                                                                      result(err, null);
                                                                      return;
                                                               } else {



                                                                      data = {
                                                                             'status': 1,
                                                                             'msg': 'Get User View List Successfully',
                                                                             'social_link': "https://app.pinned.eu/pinned/get_user/" + username,
                                                                             'social_id': 0,
                                                                             'link': "https://app.pinned.eu/pinned/get_user/" + username,
                                                                             'random_number': random_number,
                                                                      }

                                                                      console.log('Data2->' + JSON.stringify(data));

                                                                      result(null, data);
                                                                      return;


                                                               }

                                                        });

                                                 } else {

                                                        if (res3[0].length != 0) {
                                                               platform_name = res3[0].social_link;

                                                               console.log("Social URL is " + platform_name);

                                                               /*Send Emit Of Updated Count*/

                                                               if (res3[0].social_id == 1) {
                                                                      link = "https://www.instagram.com/" + platform_name;
                                                               } else if (res3[0].social_id == 2) {
                                                                      link = platform_name; //"fb://profile/" +

                                                               } else if (res3[0].social_id == 3) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 4) {
                                                                      link = "https://cash.app/" + platform_name;

                                                               } else if (res3[0].social_id == 5) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 6) {
                                                                      link = "https://pinterest.com/" + platform_name;

                                                               } else if (res3[0].social_id == 7) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 8) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 9) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 10) {

                                                                      /*Send Contact info emit*/
                                                                      try {
                                                                             emit_data = {};
                                                                             emit_data.user_id = res[0].id;
                                                                             emit_data.phone_number = platform_name;
                                                                             emit_data.random_number = random_number;

//                                            io.sockets.connected[res[0].socket_id].emit('getphonenumber', emit_data);
                                                                             io.emit('getphonenumber', emit_data);
                                                                             console.log('emit data ->' + JSON.stringify(emit_data));
                                                                             console.log("getphonenumber Emit Send Successfully");

                                                                      } catch (e) {
                                                                             console.log(e);
                                                                      }

                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 11) {
                                                                      link = "https://www.snapchat.com/add/" + platform_name;

                                                               } else if (res3[0].social_id == 12) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 13) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 14) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 15) {
                                                                      link = "https://www.twitch.tv/" + platform_name;

                                                               } else if (res3[0].social_id == 16) {
                                                                      link = "https://twitter.com/" + platform_name;

                                                               } else if (res3[0].social_id == 17) {

                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 18) {
                                                                      link = "https://wa.me/" + platform_name;

                                                               } else if (res3[0].social_id == 19) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 20) {
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 21) { //Tinder
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 22) { //Apple Music
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 23) { //Paysera
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 24) { //Fiver
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 25) { //Alibaba
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 26) { //Pinterest
                                                                      link = 'https://pinterest.com/' + platform_name;

                                                               } else if (res3[0].social_id == 27) { //Tinder
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 28) { //VK
                                                                      link = 'https://vk.com/' + platform_name;

                                                               } else if (res3[0].social_id == 29) { //Viber
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 30) { //Telegram
                                                                      link = 'https://telegram.me/' + platform_name;

                                                               } else if (res3[0].social_id == 31) { //Skype
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 32) { //Odnokassniki
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 33) { //TransferWise
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 34) { //Amazon Business
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 35) { //Link
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 36) { //OnlyFans
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 37) { //Linktree
                                                                      link = platform_name;

                                                               } else if (res3[0].social_id == 38) { //Calendly
                                                                      link = "https://calendly.com/" + platform_name;
                                                               } else if (res3[0].social_id == 39) { //Clubhouse
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 40) { //eToro
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 44) { //Podcast
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 51) { //Google Docs
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 52) { //Google Sheets
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 53) { //Google Slides
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 47) { //Embedded Video
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 41) { //Zoom
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 45) { //Etsy
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 43) { //Ethereum
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 42) { //Bitcoin
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 46) { //Shopify
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 48) { //Excel
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 49) { //PDF file
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 50) { //CSV file
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 51) { //Google Docs
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 52) { //Google Sheets
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 53) { //Google Slides
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 54) { //Jeunesse
                                                                      link = platform_name;
                                                               } else if (res3[0].social_id == 55) { //Vimeo
                                                                      link = platform_name;
                                                               } else {
                                                                      link = platform_name;

                                                               }

                                                               data = {
                                                                      'status': 1,
                                                                      'msg': 'Get User View List Successfully',
                                                                      'social_link': platform_name,
                                                                      'social_id': res3[0].social_id,
                                                                      'link': link,
                                                                      'random_number': random_number
                                                               }

                                                               console.log('Data3->' + JSON.stringify(data));

                                                               result(null, data);
                                                               return;

                                                        } else {
                                                               console.log("Go To hell");
                                                        }


                                                 }

                                          }

                                   });

                            }

                     } else {

                            data = {
                                   "status": "0",
                                   "msg": "No User Fond!",
                            };

                            console.log(data);
                            result(null, data);
                            return;
                     }

              }

       });

};

ApiModel.sendEmit = (req, result) => {

       sql.query("SELECT * FROM users where id = ?", [req.body.sendto_id], (err2, res2) => {

              /*Send Updated Count emit Here*/
              try {
                     emit_data = {};
                     emit_data.user_id = req.body.user_id;
                     emit_data.count = req.body.count;

                     if (io.sockets.sockets[res2[0].socket_id] != undefined) {
                            io.sockets.connected[res2[0].socket_id].emit('updatecount', emit_data);
                            console.log("Emit Send Successfully");
                     } else {
                            console.log("Socket not connected");
                     }

              } catch (e) {
                     console.log(e);
              }

       });


       result(null, null);
       return;

};

ApiModel.sendEmitContactApi = (req, result) => {


       sql.query("SELECT * FROM users where id = ?", [req.body.sendto_id], (err2, res2) => {

              /*Send Updated Count emit Here*/
              try {

                     emit_data = {};
                     emit_data.user_id = req.body.user_id;
                     emit_data.phone_number = platform_name;
                     emit_data.random_no = Math.floor(100000 + Math.random() * 900000);

                     if (io.sockets.sockets[res2[0].socket_id] != undefined) {
                            io.sockets.connected[res2[0].socket_id].emit('getphonenumber', emit_data);
                            console.log("getphonenumber Emit Send Successfully");
                     } else {
                            console.log("Socket not connected");
                     }

              } catch (e) {
                     console.log(e);
              }

       });


       result(null, null);
       return;

};

module.exports = ApiModel;