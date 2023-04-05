const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/decodeToken");

// Import All Controller
const { transactionController } = require("../controllers");

// import upload middleware
const uploadImagesPaymentProof = require("../middleware/uploadPaymnetProof");

Router.get("/list", transactionController.list);
Router.get("/roomList", transactionController.getRoomList);
Router.get("/roomListOnly", transactionController.roomListFromHomepage);
Router.get("/order-list", verifyToken, transactionController.getOrderList);
Router.get(
  "/users-order-list",
  verifyToken,
  transactionController.getUserOrderList
);
Router.get("/checkout/:room_id", verifyToken, transactionController.checkout);
Router.post("/book", verifyToken, transactionController.onBookRoom);
Router.patch(
  "/tenant-order-status/:id",
  verifyToken,
  transactionController.tenantUpdateOrderStatus
);
Router.get(
  "/filter-order-list",
  verifyToken,
  transactionController.getTenantOrderFilter
);
Router.get(
  "/filter-users-order-list",
  verifyToken,
  transactionController.getUserOrderFilter
);
Router.patch(
  "/upload-payment/:order_id",
  verifyToken,
  uploadImagesPaymentProof,
  transactionController.onUploadPaymentProof
);
Router.post("/create-review", verifyToken, transactionController.onCreateReview)

module.exports = Router;
