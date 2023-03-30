const express = require("express");
const Router = express.Router();

// Import All Controller
const { transactionController } = require("../controllers");

const { verifyToken } = require("../middleware/decodeToken");

Router.get("/list", transactionController.list);
Router.get("/roomList", transactionController.getRoomList);
Router.get("/roomListOnly", transactionController.roomListFromHomepage);
Router.get("/order-list", transactionController.getOrderList);
Router.get(
  "/users-order-list",
  verifyToken,
  transactionController.getUserOrderList
);
Router.get("/checkout/:room_id", verifyToken, transactionController.checkout);
Router.post("/book", verifyToken, transactionController.onBookRoom);

module.exports = Router;
