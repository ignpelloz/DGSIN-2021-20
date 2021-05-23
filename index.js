var express = require("express");
var path = require("path");
var bp = require("body-parser");

const BASE_API = "/api/v1";

var contacts = [
  {
    "name" : "JohnDoe",
    "email": "john.doe@example.com",
    "phone": 954123456
  },
  {
    "name" : "BobDoe",
    "email": "bob.doe@example.com",
    "phone": 956123456
  },
  {
    "name" : "JohnDilo",
    "email": "john.dilo@example.com",
    "phone": 954123488
  },
  {
    "name" : "BobAlice",
    "email": "bob.alice@example.com",
    "phone": 954803456
  }
]

var app = express(); // server

app.get("/hello", (req,res) => {
  res.send("Serving GET to /hello");
});

// Middleware (dirname is PWD)
app.use("/", express.static(path.join(__dirname, "public")));

// Middleware: asure everywhere JSON's used for both req and res
app.use(bp.json())

//Controllers - One method per HTTP verb (blue table)
// GET a collection
app.get(BASE_API + "/contacts", (req,res) => {
  //res.send(JSON.stringify(contacts)); // better use body parser
  res.send(contacts);
});

//POST over a collection
app.post(BASE_API + "/contacts", (req, res) => {
  contacts.push(req.body);
  res.sendStatus(201);
});

//DELETE over a collection
app.delete(BASE_API + "/contacts", (req,res) => {
  contacts = new Array();
  res.sendStatus(200);
});

//PUT over a collection
app.put(BASE_API + "/contacts", (req, res) => {
  console.warn("New PUT request to /contacts, sending 405"); // TODO: add to all methods
  res.sendStatus(405);
});

// GET a specific resource
app.get(BASE_API + "/contacts/:name", (req, res) => {
  var name = req.params.name;
  if (!name) {
    console.warn("New GET request to /contacts/:name without name, sending 400...");
    response.sendStatus(400); // bad request
  }else{
    console.info("New GET request to /contacts/" + name);
    var filteredContacts = contacts.filter((c) => {
      if (c.name === name){
        return c;
      }
    });
    if (filteredContacts.length > 0){
      res.send(filteredContacts[0])
    }else {
      console.log("No contact was found with name " + name);
      res.sendStatus(404); // not found
    }
  }
});

// DELETE a specific resource - filter, create a new array
app.delete(BASE_API + "/contacts/:name", (req, res) => {
  var name = req.params.name;
  if (!name) {
    console.info("New DELEST request to /contacts/:name without name, sending 400...");
    res.sendStatus(400); //bad request
  }else {
    console.info("New DELEST request to /contacts/" + name);
    contacts = contacts.filter((e) => {
      return e.name != name;
    });
    res.sendStatus(204); // TODO: should check if the object was removed. If not, send 404
  }
});

// PUT - use map. If it doesn't exist, 409
app.put(BASE_API + "/contacts/:name", (req, res) => {
  var name = req.params.name;
  var updatedContact = req.body;
  if (!name){
    console.warn("New PUT request to /contacts/:name without name, sending 400...");
    response.sendStatus(400);
  }else if(!updatedContact){
    console.warn("New PUT request to /contacts/ without contact, sending 400...");
    response.sendStatus(400);
  }else{
    console.info("New PUT request to /contacts/" + name + " with data " + JSON.stringify(updatedContact));
    if (!updatedContact.name || !updatedContact.phone || !updatedContact.email) {
      onsole.warn("The contact " + JSON.stringify(updatedContact) + " is not well-formed, sending 422");
      response.sendStatus(422);
    }else {
      var found = false;
      contacts = contacts.map((c) => {
        if (c.name === name) {
          found = true;
          return updatedContact;
        }else {
          return c;
        }
      })
    }
  }
});

// POST a specific resource - return 405 as not allowed
app.post(BASE_API + "/contacts/:name", (req, res) => {
  console.warn("New POST request to a specific resource, sending 405"); // TODO: add these logs to all methods
  res.sendStatus(405);
});

// env variable or hardcoded
app.listen(process.env.PORT || 8080, () => {
  console.log("Server ready");
}).on("error", (e) => {
  console.error("Server not ready");
});
