const express = require('express')
const Router = express.Router()

const { roomController } = require("../controllers")

const { verifyToken } = require("../middleware/decodeToken");

Router.get("/get-data/:property_id", verifyToken, roomController.getRoomData)
Router.post("/create/:property_id", verifyToken, roomController.createRoom)
Router.patch("/update/:room_id", verifyToken, roomController.updateRoom)
Router.delete("/delete/:room_id", verifyToken, roomController.deleteRoom)

module.exports = Router