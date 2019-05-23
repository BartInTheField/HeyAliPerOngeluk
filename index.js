const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const getServers = async () => {
  return await fetch("http://eureka.aliperongeluk.eu/eureka/apps");
};

// Google Assistant deps
const { dialogflow, SimpleResponse } = require("actions-on-google");
const app = dialogflow({ debug: true });

app.intent("Get the service status", async conv => {
  conv.close(
    new SimpleResponse({
      text: "All servers are up!",
      speech: "All servers seem to be up"
    })
  );
});

const expressApp = express().use(bodyParser.json());

expressApp.get("*", (req, res) => {
  res.send("This is a Google Assistant app!");
});

expressApp.post("*", app);

module.exports = expressApp;
