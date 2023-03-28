const express = require("express");
const Router = express.Router();

// Import All Controller
const { transactionController } = require("../controllers");

Router.get("/list", transactionController.list);
Router.get("/roomList", transactionController.getRoomList);
Router.get("/roomListOnly", transactionController.roomListFromHomepage);

module.exports = Router;