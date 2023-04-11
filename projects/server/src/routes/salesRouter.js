const express = require("express");
const Router = express.Router();

const { salesController } = require("../controllers");

const { verifyToken } = require("../middleware/decodeToken");

Router.get("/get-report-by-user", verifyToken, salesController.reportByUser);
Router.get(
  "/get-report-by-property",
  verifyToken,
  salesController.reportByProperty
);

module.exports = Router;
