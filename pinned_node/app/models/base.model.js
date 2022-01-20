const sql = require("./db.js");

// constructor
const Base = function (base) {

};

Base.findById = (baseTable, baseIArr, result) => {
    sql.query('SELECT * FROM ' + baseTable + ' WHERE ' + baseIArr + ' limit 1', (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
//      console.log("found base: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Base with the id
        result(null, {user_id: 0});
    });
};

Base.updateById = (baseTable, baseArr, baseUpdate , result) => {
    sql.query(
            "UPDATE " + baseTable + " SET ... WHERE "+baseArr+"",baseUpdate,(err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Base with the id
            result({kind: "not_found"}, null);
            return;
        }

        console.log("updated base: ", {id: id, ...base});
        result(null, {id: id, ...base});
    }
    );
};

Base.findExits = (baseTable, baseIArr, result) => {

    sql.query('SELECT * FROM ' + baseTable + ' WHERE ' + baseIArr + ' limit 1', (err, res) => {

        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length > 0) {
            result(null, true);
        } else {
            result(null, false);
            ;
        }

    });

};

module.exports = Base;