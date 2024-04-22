const serverless = require("serverless-http");
const express = require("express");
const { getServices, filterDocumentByService } = require("./models/smileCenters.model");
const app = express();

app.get("/getservices", async(req, res, next) => {
  const services = await getServices();
  return res.status(200).json({
    services
  });
});

app.get("/filterbyservice", async (req, res, next) => {
  const result = await filterDocumentByService("fullprimera");
  return res.status(200).json({
    result,
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
