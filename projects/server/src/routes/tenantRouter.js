const express = require("express");
const Router = express.Router();

// Import All Controller
const { tenantController } = require("../controllers");
const uploadImages = require("../middleware/upload");

Router.post("/register", tenantController.register);
Router.post("/verify", uploadImages, tenantController.verifyTenant);
Router.get("/login", tenantController.login);

module.exports = Router;
