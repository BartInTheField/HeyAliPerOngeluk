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
  getServers()
    .then(res => {
      conv.json(res);
      conv.close(
        new SimpleResponse({
          text: "All servers are up!",
          speech: "All servers seem to be up"
        })
      );
    })
    .catch(e => {
      conv.close(
        new SimpleResponse({
          text: "Oops",
          speech: "Oops we fucked up"
        })
      );
    });
});

const expressApp = express().use(bodyParser.json());

expressApp.get("*", (req, res) => {
  res.send("This is a Google Assistant app!");
});

expressApp.post("*", app);

module.exports = expressApp;
