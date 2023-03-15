const express = require("express");
const Router = express.Router();

const { propertyController } = require("../controllers");
const uploadImages = require("../middleware/upload");
Router.post("/createProperty", propertyController.createProperty);
Router.post(
  "/propertyImageUpload",
  uploadImages,
  propertyController.createPropertyImage
);
Router.get("/getAllProperty", propertyController.getAllProperty);
Router.get("/getType", propertyController.getType);
Router.delete("/deleteProperty", propertyController.deleteProperty);
Router.patch("/updateProperty", propertyController.updateProperty);
Router.patch("/updatePropertyImage", propertyController.updatePropertyImage);

module.exports = Router;
