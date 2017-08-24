const path = require("path");
const express = require("express");
const compression = require("compression");

const port = process.env.NODE_EXPOSE_PORT || 3000;
const host = process.env.NODE_EXPOSE_IP || "localhost";

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
