const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/decodeToken");

// Import All Controller
const { transactionController } = require("../controllers");

Router.get("/list", transactionController.list);
Router.get("/roomList", transactionController.getRoomList);
Router.get("/roomListOnly", transactionController.roomListFromHomepage);
Router.get('/order-list', verifyToken, transactionController.getOrderList)
Router.get("/checkout/:room_id", verifyToken, transactionController.checkout)
Router.post("/book", verifyToken, transactionController.onBookRoom)
Router.patch('/tenant-order-status/:id', verifyToken, transactionController.tenantUpdateOrderStatus)

module.exports = Router;
