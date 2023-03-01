import express from "express";
import config from "config";

const port = config.get("app.port");

const app = express();

const start = async () => {
  try {
    app.listen(port, () => console.log("listening on port " + port));
  } catch (e) {
    console.log(e);
  }
};

start();
