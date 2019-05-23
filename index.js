const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const knownServices = require("./src/services");

const getServers = async () => {
  return new Promise((resolve, reject) => {
    fetch("http://eureka.aliperongeluk.eu/eureka/apps", {
      headers: { Accept: "application/json" }
    })
      .then(res => res.json())
      .then(body => resolve(body.applications.application))
      .catch(e => reject(e));
  });
};

const pushInstancesInServices = (applications, services) => {
  applications.forEach(application => {
    application.instance.forEach(instance => {
      const known =
        knownServices[
          knownServices.findIndex(known => known.key === instance.app)
        ];
      services.push({
        ...instance,
        ...known,
        online: instance.status === "UP"
      });
    });
  });
};

const pushOfflineServicesInServices = services => {
  knownServices.forEach(known => {
    if (services.findIndex(service => service.app === known.key) === -1) {
      services.push({
        ...known,
        online: false
      });
    }
  });
};

// Google Assistant deps
const { dialogflow, SimpleResponse, Table } = require("actions-on-google");
const app = dialogflow({ debug: true });

app.intent("Get the service status", async conv => {
  getServers()
    .then(applications => {
      const services = [];
      pushInstancesInServices(applications, services);
      pushOfflineServicesInServices(applications, services);
      const tableContent = [];

      services.forEach(service => {
        tableContent.push([
          service.title,
          service.online ? "Online" : "Offline"
        ]);
      });

      conv.ask(
        new Table({
          title: "All servers",
          columns: ["Service", "status"],
          rows: tableContent
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
