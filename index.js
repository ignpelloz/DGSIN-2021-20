var express = require("express");
var app = express(); // server

var path = require("path");

app.get("/hello", (req,res) => {
  res.send("Serving GET to /hello");
});

// Middleware (dirname is PWD)
app.use("/", express.static(path.join(__dirname, "public")));

// env variable or hardcoded
app.listen(process.env.PORT || 8080, () => {
  console.log("Server ready");
}).on("error", (e) => {
  console.error("Server not ready");
});
