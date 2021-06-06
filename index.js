var express = require("express");
var path = require("path");
var bp = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var cors = require('cors');

const BASE_API = "/api/v1";
const mdbURL = "mongodb+srv://admin:20ipldgsin@dgsin-2021-20.35bvb.mongodb.net/dgsin-20-db?retryWrites=true" // removed &w=majority

var app = express(); // server

// Middleware (dirname is PWD)
app.use("/", express.static(path.join(__dirname, "public")));

// Middleware: asure everywhere JSON's used for both req and res
app.use(bp.json())

// Middleware for CORS headers (thanks to this the backend will be able to connect to frontend, w/o XSS issues)
app.use(cors());

// DB's initial data (266 objects, hence read from an external .json)
var initialData = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// DB connection
var db;
MongoClient.connect(mdbURL, (err, client) => {
  if (err) {
    console.error("Error connecting to DB: " + err);
    process.exit(1);
  }else{
    db = client.db("dgsin-20-db").collection("alcohol-tobacco-exps");
    db.find({}).toArray((err, expenditures) => { // with an empty objects will look for all the objects inside the collection
      if (err) {
        console.error("Error getting data from DB: " + err);
      }else if (expenditures.length == 0) {
        console.info("Adding initial data to empty DB");
        db.insert(initialData);
      }else{
        console.info("Connected to the DB with " + expenditures.length + " objects");
      }
    });
  }

  // Including the 8 methods at this point (otherwise, db's undefined bc of asynchronousnes)
  var api = require("./api");
  api.register(app,db, initialData);

});

// env variable or hardcoded
app.listen(process.env.PORT || 8080, () => {
  console.log("Server ready");
}).on("error", (e) => {
  console.error("Server not ready");
});
