const BASE_API = "/api/v1";

module.exports.register = function(app, db) {

  // Postman docs
  app.get("/docs", (req,res) => {
    res.redirect("https://documenter.getpostman.com/view/1776636/TzXtKLsz");
  });

  //Controllers - One method per HTTP verb (blue table)

  // GET a collection
  app.get(BASE_API + "/alcohol-tobacco-exps", (req, res) => {
      console.info("New GET request to /alcohol-tobacco-exps");
      db.find({}).toArray((err, expenditures) => {
          if (err) {
              console.error("Error getting data from DB: " + err);
              res.sendStatus(500);
          } else {
              console.debug("Sending expenditures: " + JSON.stringify(expenditures, null, 2));
              res.send(expenditures);
          }
      });
  });

  // POST over a collection
  app.post(BASE_API + "/alcohol-tobacco-exps", (req, res) => {
      var newExpenditure = req.body;
      if (!newExpenditure) {
          console.warn("New POST request to /alcohol-tobacco-exps/ without expenditure, sending 400...");
          res.sendStatus(400); //bad request
      } else {
          console.info("New POST request to /alcohol-tobacco-exps with body: " + JSON.stringify(newExpenditure, null, 2));
          if (!newExpenditure.autonomous_community || !newExpenditure.year || !newExpenditure.avg_expenditure_household || !newExpenditure.avg_expenditure_person || !newExpenditure.porcentual_distribution) {
              console.warn("The expenditure " + JSON.stringify(newExpenditure, null, 2) + " is not well-formed, sending 422...");
              res.sendStatus(422); // unprocessable entity
          } else {
              db.find({ "name": newExpenditure.name }).toArray((err, expenditures) => {
                  if (err) {
                      console.error("Error getting data from DB: " + err);
                      res.sendStatus(500);
                  } else {
                      if (expenditures.length > 0) {
                          console.warn("The expenditure " + JSON.stringify(newExpenditure, null, 2) + " already exists, sending 409...");
                          res.sendStatus(409); // conflict
                      } else {
                          console.debug("Adding expenditure " + JSON.stringify(newExpenditure, null, 2));
                          db.insert(newExpenditure);
                          res.sendStatus(201); // created
                      }
                  }
              });
          }
      }
  });

  // DELETE over a collection
  app.delete(BASE_API + "/alcohol-tobacco-exps", (req, res) => {
      console.info("New DELETE request to /alcohol-tobacco-exps");
      db.remove({}, { multi: true }, (err, result) => {
          if (err) {
              console.error('Error removing data from DB');
              res.sendStatus(500); // internal server error
          } else {
              var numRemoved = result.result.n;
              if (numRemoved === 0) {
                  console.warn("There are no expenditures to delete");
                  res.sendStatus(404); // not found
              } else {
                  console.debug("All the expenditures (" + numRemoved + ") have been succesfully deleted, sending 204...");
                  res.sendStatus(204); // no content
              }
          }
      });
  });

  // PUT over a collection
  app.put(BASE_API + "/alcohol-tobacco-exps", (req, res) => {
      console.warn("New PUT request to /alcohol-tobacco-exps, sending 405...");
      res.sendStatus(405); // method not allowed
  });

  // GET a specific resource
  app.get(BASE_API + "/alcohol-tobacco-exps/:name", (req, res) => {
      var name = req.params.name;
      if (!name) {
          console.warn("New GET request to /alcohol-tobacco-exps/:name without name, sending 400...");
          res.sendStatus(400); // bad request
      } else {
          console.info("New GET request to /alcohol-tobacco-exps/" + name);
          db.find({ "name": name }).toArray((err, filteredExpenditures) => {
              if (err) {
                  console.error('Error getting data from DB');
                  res.sendStatus(500); // internal server error
              } else {
                  if (filteredExpenditures.length > 0) {
                      var expenditure = filteredExpenditures[0]; //since we expect to have exactly ONE expenditure with this name
                      console.debug("Sending expenditure: " + JSON.stringify(expenditure, null, 2));
                      res.send(expenditure);
                  } else {
                      console.warn("There are not any expenditure with name " + name);
                      res.sendStatus(404); // not found
                  }
              }
          });
      }
  });

  // DELETE a specific resource
  app.delete(BASE_API + "/alcohol-tobacco-exps/:name", (req, res) => {
      var name = req.params.name;
      if (!name) {
          console.warn("New DELETE request to /alcohol-tobacco-exps/:name without name, sending 400...");
          res.sendStatus(400); // bad request
      } else {
          console.info("New DELETE request to /alcohol-tobacco-exps/" + name);
          db.remove({ name: name }, {}, function (err, result) {
              if (err) {
                  console.error('Error removing data from DB');
                  res.sendStatus(500); // internal server error
              } else {
                  var numRemoved = result.result.n;
                  console.debug("expenditures removed: " + numRemoved);
                  if (numRemoved === 1) {
                      console.debug("The expenditure with name " + name + " has been succesfully deleted, sending 204...");
                      res.sendStatus(204); // no content
                  } else {
                      console.warn("There are no expenditures to delete");
                      res.sendStatus(404); // not found
                  }
              }
          });
      }
  });

  // PUT over a specific resource
  app.put(BASE_API + "/alcohol-tobacco-exps/:name", (req, res) => {
      var name = req.params.name;
      var updatedExpenditure = req.body;
      if (!name) {
          console.warn("New PUT request to /alcohol-tobacco-exps/:name without name, sending 400...");
          res.sendStatus(400); // bad request
      } else if (!updatedExpenditure) {
          console.warn("New PUT request to /alcohol-tobacco-exps/ without expenditure, sending 400...");
          res.sendStatus(400); // bad request
      } else {
          console.info("New PUT request to /alcohol-tobacco-exps/" + name + " with data " + JSON.stringify(updatedExpenditure, null, 2));
          if (!updatedExpenditure.autonomous_community || !updatedExpenditure.year || !updatedExpenditure.avg_expenditure_household || !updatedExpenditure.avg_expenditure_person || !updatedExpenditure.porcentual_distribution) {
              console.warn("The expenditure " + JSON.stringify(updatedExpenditure, null, 2) + " is not well-formed, sending 422...");
              res.sendStatus(422); // unprocessable entity
          } else {
              db.find({ "name": name }).toArray((err, expenditures) => {
                  if (err) {
                      console.error('Error getting data from DB');
                      res.sendStatus(500); // internal server error
                  } else {
                      if (expenditures.length > 0) {
                          db.update({ name: name }, updatedExpenditure);
                          console.debug("Modifying expenditure with name " + name + " with data " + JSON.stringify(updatedExpenditure, null, 2));
                          res.send(updatedExpenditure); // return the updated expenditure
                      } else {
                          console.warn("There are not any expenditure with name " + name);
                          res.sendStatus(404); // not found
                      }
                  }
              });
          }
      }
  });

  // POST a specific resource
  app.post(BASE_API + "/alcohol-tobacco-exps/:name", (req, res) => {
      var name = req.params.name;
      console.warn("New POST request to /alcohol-tobacco-exps/" + name + ", sending 405...");
      res.sendStatus(405); // method not allowed
  });

}
