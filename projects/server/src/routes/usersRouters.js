const express = require("express");
const Router = express.Router();

const { usersControllers } = require("../controllers");
const uploadImagesProfilePic = require("../middleware/uploadProfilePic");
const { verifyToken } = require("../middleware/decodeToken");

Router.post("/register", usersControllers.register);
Router.get("/checkusername", usersControllers.checkUsername);
Router.get("/checkemail", usersControllers.checkEmail);
Router.get("/login", usersControllers.login);
Router.post("/keep-login", verifyToken, usersControllers.keepLogin)
Router.get("/userdetail", usersControllers.userDetail);
Router.get("/check-token/:token", usersControllers.checkToken)
Router.get("/reset-confirm", usersControllers.resetConfirm);
Router.patch("/change-password/:id", usersControllers.newPassword);
Router.post("/verify-otp", verifyToken, usersControllers.onVerifyAccount);
Router.get("/send-otp", verifyToken, usersControllers.onSendOTP);
Router.get("/user-data", verifyToken, usersControllers.onGetUserData);
Router.post("/user-profile", verifyToken, usersControllers.userProfile);
Router.patch(
  "/change-new-password",
  verifyToken,
  usersControllers.changeNewPassword
);
Router.post("/new-profile/:id", usersControllers.newProfile);
Router.patch("/edit-profile/:id", usersControllers.editProfile);
Router.post("/getuser", verifyToken, usersControllers.getUser);
Router.patch(
  "/profile-pic/:id",
  uploadImagesProfilePic,
  usersControllers.updateProfilePicture
);
Router.patch("/change-email/:id", usersControllers.changeEmail);

module.exports = Router;
