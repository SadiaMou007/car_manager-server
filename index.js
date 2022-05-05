const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

//middle wire
const cors = require("cors");
app.use(cors());
app.use(express.json());

//root api
app.get("/", (req, res) => {
  res.send("running");
});
app.listen(port, () => {
  console.log("Listening to port");
});
