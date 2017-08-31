const path = require("path");
const express = require("express");
const compression = require("compression");

const port = process.env.npm_package_config_port || 8080;
const host = process.env.npm_package_config_host || "localhost";

const app = express();

app.use(compression());
app.use("/redux-arena", express.static(path.join(__dirname, "dist")));
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(port, (err, result) => {
  if (err) {
    return console.log(err);
  }
  console.log(`The server is running at http://${host}:${port}/`);
});
