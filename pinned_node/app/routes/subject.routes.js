module.exports = function(app) {
  const subjects = require("../controllers/subject.controller.js");

  // Create a new Customer
  app.post("/subjects", subjects.create);

  // Retrieve all Customers
  app.get("/subjects", subjects.findAll);

  // Retrieve a single Customer with subjectId
  app.get("/subjects/:subjectId", subjects.findOne);

  // Update a Customer with subjectId
  app.put("/subjects/:subjectId", subjects.update);

  // Delete a Customer with subjectId
  app.delete("/subjects/:subjectId", subjects.delete);

  // Create a new Customer
  app.delete("/subjects", subjects.deleteAll);
};