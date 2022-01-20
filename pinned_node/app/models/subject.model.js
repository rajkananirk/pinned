const sql = require("./db.js");

// constructor
const Subject = function(subject) {
  this.email = subject.email;
  this.name = subject.name;
  this.active = subject.active;
};

Subject.create = (newSubject, result) => {
  sql.query("INSERT INTO tbl_price SET ?", newSubject, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created subject: ", { id: res.insertId, ...newSubject });
    result(null, { id: res.insertId, ...newSubject });
  });
};

Subject.findById = (subjectId, result) => {
  sql.query(`SELECT * FROM tbl_price WHERE id = ${subjectId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found subject: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Subject with the id
    result({ kind: "not_found" }, null);
  });
};

Subject.getAll = result => {
  sql.query("SELECT * FROM tbl_price", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("subject: ", res);
    result(null, res);
  });
};

Subject.updateById = (id, subject, result) => {
  sql.query("UPDATE tbl_price SET email = ?, name = ?, active = ? WHERE id = ?",
    [subject.email, subject.name, subject.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Subject with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated subject: ", { id: id, ...subject });
      result(null, { id: id, ...subject });
    }
  );
};

Subject.remove = (id, result) => {
  sql.query("DELETE FROM tbl_price WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Subject with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted subject with id: ", id);
    result(null, res);
  });
};

Subject.removeAll = result => {
  sql.query("DELETE FROM tbl_price", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} subject`);
    result(null, res);
  });
};

module.exports = Subject;