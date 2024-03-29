const express = require("express");
const Router = express.Router();

const { roomController } = require("../controllers");

const { verifyToken } = require("../middleware/decodeToken");

Router.get("/get-data/:property_id", verifyToken, roomController.getRoomData);
Router.post("/create/:property_id", verifyToken, roomController.createRoom);
Router.patch("/update/:room_id", verifyToken, roomController.updateRoom);
Router.delete("/delete/:room_id", verifyToken, roomController.deleteRoom);
Router.get("/room-data/:room_id", verifyToken, roomController.getRoomDetail);
Router.post("/unavailable", roomController.addUnavailable);
Router.post("/special-price", roomController.addSpecialPrice);
Router.get("/unavailable-room/:room_id", roomController.getUnavailableRoom);
Router.get("/check-special/:room_id", roomController.checkSpecial);
Router.get(
  "/check-special-calendar/:room_id",
  roomController.checkSpecialCalendar
);
Router.get("/get-room-special-price", roomController.getRoomSpecialPrice);

module.exports = Router;
