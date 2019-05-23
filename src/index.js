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
  const servers = await getServers();
  conv.json(servers);
  conv.add(
    new SimpleResponse({
      text: "All servers are up!",
      speech: "All servers seem to be up"
    })
  );
});

const expressApp = express().use(bodyParser.json());

expressApp.post("/fulfillment", app);

expressApp.listen(3000);