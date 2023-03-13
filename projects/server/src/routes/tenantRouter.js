const express = require("express");
const Router = express.Router();

// Import All Controller
const { tenantController } = require("../controllers");
const uploadImages = require("../middleware/upload");
const { verifyToken } = require("../middleware/decodeToken");

Router.post("/register", tenantController.register);
Router.post("/verify", uploadImages, tenantController.verifyTenant);
Router.get("/login", tenantController.login);
Router.get("/category", tenantController.getCategory);
Router.post("/category", tenantController.createCategory);
Router.patch("/category", tenantController.updateCategory);
Router.delete("/category", tenantController.deleteCategory);
Router.post("/checkLogin/:id", verifyToken, tenantController.checkTenant);

module.exports = Router;
