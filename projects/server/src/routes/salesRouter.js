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
Router.get("/get-property-list", verifyToken, salesController.getPropertyList);
Router.get("/get-total-profit", verifyToken, salesController.getTotalProfit)
Router.get("/get-total-transaction", verifyToken, salesController.getTotalTransaction)

module.exports = Router;