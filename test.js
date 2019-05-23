const fetch = require("node-fetch");

const getServers = async () => {
  fetch("http://eureka.aliperongeluk.eu/eureka/apps", {
    headers: { Accept: "application/json" }
  })
    .then(res => res.json())
    .then(body => console.log(body.applications.application));
};

getServers();
