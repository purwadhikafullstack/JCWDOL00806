const express = require("express");
const Router = express.Router();

const { propertyController } = require("../controllers");
const uploadImages = require("../middleware/upload");
const uploadImagesProperty = require("../middleware/uploadProperty");
Router.post("/createProperty", propertyController.createProperty);
Router.post(
  "/propertyImageUpload",
  uploadImagesProperty,
  propertyController.createPropertyImage
);
Router.get("/getAllProperty", propertyController.getAllProperty);
Router.get("/getType", propertyController.getType);
Router.delete("/deleteProperty", propertyController.deleteProperty);
Router.patch("/updateProperty", propertyController.updateProperty);
Router.patch(
  "/updatePropertyImage",
  uploadImagesProperty,
  propertyController.updatePropertyImage
);
Router.get("/landing-page-content", propertyController.getPropertyContent)

module.exports = Router;
