const serverless = require("serverless-http");
const express = require("express");
const SmileCenterRepository = require("./repositories/smileCenter.repository");
const app = express();

app.get("/get-attributes-to-filter", async(req, res, next) => {
  return res.status(200).json(await SmileCenterRepository.getAttributesToFilter());
});

app.get("/filter-smile-centers", async (req, res, next) => {
  return res.status(200).json(await SmileCenterRepository.filterDocument(req.query));
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
