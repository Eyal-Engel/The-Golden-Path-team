const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const BalisticThrow = require("./golden.js");
const PaintBalisticThrow = require("./calculatePositions.js");

const port = 3030;

const app = express();

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

app.use(cors());
app.use(express.json());

const validationParams = (V0, initialAngle, h0) => {
  if (!V0 || V0 < 0) {
    throw new Error("Invalid V0");
  }

  if (!initialAngle || initialAngle > 90 || initialAngle < 0) {
    throw new Error("Invalid initialAngle");
  }

  if (!h0 || h0 < 0) {
    throw new Error("Invalid h0");
  }
};

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/main.html");
});

/* Get HTTP request from client 
   Params: V0, initialAngle, h0.                                        */
app.get("/getBalisticThrow", (req, res) => {
  try {
    const { V0, initialAngle, h0 } = req.query;

    // validations
    validationParams(V0, initialAngle, h0);

    const data = {
      values: BalisticThrow(V0, initialAngle, h0),
      positions: PaintBalisticThrow(V0, initialAngle, h0),
    };
    console.log("Calculated balistic throw successfully!");
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});
