const express = require("express");
const Router = express.Router();

// Import All Controller
const { transactionController } = require("../controllers");

Router.get("/list", transactionController.list);

module.exports = Router;
