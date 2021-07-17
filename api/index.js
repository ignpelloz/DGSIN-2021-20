const BASE_API = "/api/v1";

function checkResource(expenditure) { // Uisng '!' is not enough as it leaves out 0 (which is a valid value)
  if (expenditure.autonomous_community === undefined ||
    expenditure.year === undefined ||
    expenditure.avg_expenditure_household === undefined ||
    expenditure.avg_expenditure_person === undefined ||
    expenditure.porcentual_distribution === undefined ||
    expenditure.autonomous_community === null ||
    expenditure.year === null ||
    expenditure.avg_expenditure_household === null ||
    expenditure.avg_expenditure_person === null ||
    expenditure.porcentual_distribution === null ||
    String(expenditure.autonomous_community).trim() === "" ||
    String(expenditure.year).trim() === "" ||
    String(expenditure.avg_expenditure_household).trim() === "" ||
    String(expenditure.avg_expenditure_person).trim() === "" ||
    String(expenditure.porcentual_distribution).trim() === "") {
    return false
  } else {
    return true
  }
}

module.exports.register = function(app, db, initialData) {

  // Postman docs
  app.get(BASE_API + "/alcohol-tobacco-exps/docs", (req, res) => {
    res.redirect("https://documenter.getpostman.com/view/1776636/TzXtKLsz");
  });

  //Controllers - One method per HTTP verb (blue table)

  app.get(BASE_API + "/alcohol-tobacco-exps/loadInitialData", (req, res) => {
    console.info("New GET request to /alcohol-tobacco-exps/loadInitialData");
    db.find({}).toArray((err, expenditures) => {
      if (err) {
        console.error("Error getting data from DB: " + err);
        res.sendStatus(500);
      } else {
        if (expenditures.length == 0) {
          console.info("Adding data to empty DB");
          db.insert(initialData);
          res.sendStatus(201); // created
        } else {
          console.debug(`The database contains ${expenditures.length} expenditures. Nothing to do`);
          res.sendStatus(200);
        }
      }
    });
  });

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
      //if (!newExpenditure.autonomous_community || !newExpenditure.year || !newExpenditure.avg_expenditure_household || !newExpenditure.avg_expenditure_person || !newExpenditure.porcentual_distribution) {
      if (!checkResource(newExpenditure)) {
        console.warn("The expenditure " + JSON.stringify(newExpenditure, null, 2) + " is not well-formed, sending 422...");
        res.sendStatus(422); // unprocessable entity
      } else {
        var autonomous_community = newExpenditure.autonomous_community
        var year = newExpenditure.year
        db.find({
          "autonomous_community": autonomous_community,
          "year": JSON.parse(year)
        }).toArray((err, expenditures) => {
          if (err) {
            console.error("Error getting data from DB: " + err);
            res.sendStatus(500);
          } else {
            if (expenditures.length > 0) {
              console.warn(`A resource already exists for autonomous_community: ${autonomous_community} and year: ${year} sending 409...`);
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
    db.remove({}, {
      multi: true
    }, (err, result) => { // TODO: deprecated. Use deleteOne, deleteMany, or bulkWrite instead
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
  app.put(BASE_API + "/alcohol-tobacco-exps/:autonomous_community", (req, res) => {
    console.warn("New PUT request to /alcohol-tobacco-exps/:autonomous_community, sending 405...");
    res.sendStatus(405); // method not allowed
  });

  // GET a specific resource (matching autonomous_community)
  app.get(BASE_API + "/alcohol-tobacco-exps/:autonomous_community", (req, res) => {
    var autonomous_community = req.params.autonomous_community;
    if (!autonomous_community) {
      console.warn("New GET request to /alcohol-tobacco-exps/:autonomous_community without autonomous_community, sending 400...");
      res.sendStatus(400); // bad request
    } else {
      console.info("New GET request to /alcohol-tobacco-exps/" + autonomous_community);
      db.find({
        "autonomous_community": autonomous_community
      }).toArray((err, filteredExpenditures) => {
        if (err) {
          console.error('Error getting data from DB');
          res.sendStatus(500); // internal server error
        } else {
          if (filteredExpenditures.length > 0) {
            console.debug("Sending " + filteredExpenditures.length + " expenditures");
            res.send(filteredExpenditures);
          } else {
            console.warn(`No resource found for /alcohol-tobacco-exps/${autonomous_community}`);
            res.sendStatus(404); // not found
          }
        }
      });
    }
  });

  // GET a specific resource (matching both autonomous_community and year)
  app.get(BASE_API + "/alcohol-tobacco-exps/:autonomous_community/:year", (req, res) => {
    var autonomous_community = req.params.autonomous_community;
    var year = req.params.year;
    if (!autonomous_community) {
      console.warn("New GET request to /alcohol-tobacco-exps/:autonomous_community/:year without autonomous_community, sending 400...");
      res.sendStatus(400); // bad request
    } else if (!year) {
      console.warn("New GET request to /alcohol-tobacco-exps/:autonomous_community/:year without year, sending 400...");
      res.sendStatus(400); // bad request
    } else {
      console.info("New GET request to /alcohol-tobacco-exps/" + autonomous_community + "/" + year);
      db.find({
        "autonomous_community": autonomous_community,
        "year": JSON.parse(year)
      }).toArray((err, filteredExpenditures) => {
        if (err) {
          console.error('Error getting data from DB');
          res.sendStatus(500); // internal server error
        } else {
          if (filteredExpenditures.length > 0) {
            console.debug("Sending " + filteredExpenditures.length + " expenditures");
            res.send(filteredExpenditures[0]); // There can be only 1 resource for each autonomous_community/year combination
          } else {
            console.warn(`No resource found for /alcohol-tobacco-exps/${autonomous_community}/${year}`);
            res.sendStatus(404); // not found
          }
        }
      });
    }
  });

  // DELETE a specific resource
  app.delete(BASE_API + "/alcohol-tobacco-exps/:autonomous_community/:year", (req, res) => {
    var autonomous_community = req.params.autonomous_community;
    var year = req.params.year;
    if (!autonomous_community) {
      console.warn("New DELETE request to /alcohol-tobacco-exps/:autonomous_community/:year without autonomous_community, sending 400...");
      res.sendStatus(400); // bad request
    } else if (!year) {
      console.warn("New DELETE request to /alcohol-tobacco-exps/:autonomous_community/:year without year, sending 400...");
      res.sendStatus(400); // bad request
    } else {
      console.info("New DELETE request to /alcohol-tobacco-exps/" + autonomous_community + "/" + year);
      db.remove({
        "autonomous_community": autonomous_community,
        "year": JSON.parse(year)
      }, {}, function(err, result) { // TODO: deprecated. Use deleteOne, deleteMany, or bulkWrite instead
        if (err) {
          console.error('Error removing data from DB');
          res.sendStatus(500); // internal server error
        } else {
          var numRemoved = result.result.n;
          console.debug("expenditures removed: " + numRemoved);
          if (numRemoved === 1) {
            console.debug("The expenditure /alcohol-tobacco-exps/" + autonomous_community + "/" + year + " has been succesfully deleted, sending 204...");
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
  app.put(BASE_API + "/alcohol-tobacco-exps/:autonomous_community/:year", (req, res) => {
    var autonomous_community = req.params.autonomous_community;
    var year = req.params.year;
    var updatedExpenditure = req.body;
    if (!autonomous_community) {
      console.warn("New PUT request to /alcohol-tobacco-exps/:autonomous_community/:year without autonomous_community, sending 400...");
      res.sendStatus(400); // bad request
    } else if (!year) {
      console.warn("New PUT request to /alcohol-tobacco-exps/:autonomous_community/:year without year, sending 400...");
      res.sendStatus(400); // bad request
    } else if (!updatedExpenditure) {
      console.warn("New PUT request to /alcohol-tobacco-exps/:autonomous_community/:year without expenditure, sending 400...");
      res.sendStatus(400); // bad request
    } else if (autonomous_community != updatedExpenditure.autonomous_community) {
      console.warn("New PUT request to /alcohol-tobacco-exps/:autonomous_community/:year but the provided resource's autonomous_community field differs, sending 400...");
      res.sendStatus(400); // bad request
    } else {
      console.info(`New PUT request to /alcohol-tobacco-exps/${autonomous_community}/${year} with data ` + JSON.stringify(updatedExpenditure, null, 2));
      if (!checkResource(updatedExpenditure)) {
        console.warn("The expenditure " + JSON.stringify(updatedExpenditure, null, 2) + " is not well-formed, sending 422...");
        res.sendStatus(422); // unprocessable entity
      } else {
        db.find({
          "autonomous_community": autonomous_community,
          "year": JSON.parse(year)
        }).toArray((err, expenditures) => {
          if (err) {
            console.error('Error getting data from DB');
            res.sendStatus(500); // internal server error
          } else {
            if (expenditures.length > 0) {
              db.update({
                "autonomous_community": autonomous_community,
                "year": JSON.parse(year)
              }, updatedExpenditure);
              console.debug(`Modifying expenditure with autonomous_community: ${autonomous_community} with data ` + JSON.stringify(updatedExpenditure, null, 2));
              res.send(updatedExpenditure); // return the updated expenditure
            } else {
              console.warn(`No resource found for /alcohol-tobacco-exps/${autonomous_community}/${year}`);
              res.sendStatus(404); // not found
            }
          }
        });
      }
    }
  });

  // POST a specific resource
  app.post(BASE_API + "/alcohol-tobacco-exps/:autonomous_community/:year", (req, res) => {
    console.warn(`New POST request to /alcohol-tobacco-exps/:autonomous_community/:year, sending 405...`);
    res.sendStatus(405); // method not allowed
  });

}
