const sql = require("./db.js");

// constructor
const Auth = function (base) {

};

Auth.findById = (infoObj, result) => {

    user_id = infoObj.user_id;
    user_token = infoObj.user_token;

    sql.query('select * from tbl_token t1 join tbl_user t2 on t1.user_id = t2.user_id \n\
               where t1.user_id = ? and t1.user_token = ? and t2.is_active=1 and t2.is_blocked=0', [user_id, user_token], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            res[0].isData = 1;
            result(null, res[0]);
            return;
        }

        // not found Subject with the id
        result(null, {isData: 0});
    });
};


module.exports = Auth;