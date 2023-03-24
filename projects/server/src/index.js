require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { join } = require("path");
const passport = require("passport");
const passportGoogle = require("./auth/passportGoogle");
const passportFacebook = require("./auth/passportFacebook");

const PORT = process.env.PORT || 8000;
const app = express();
// app.use(
//   cors({
//     origin: [
//       process.env.WHITELISTED_DOMAIN &&
//         process.env.WHITELISTED_DOMAIN.split(","),
//     ],
//   })
// );
app.use(
  cors({
    origin: `http://localhost:3000`,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

// Sequelize DB Sync

// const Sequelize = require("sequelize");
// const Models = require("../models");
// Models.sequelize
//   .sync({
//     force: false,
//     alter: true,
//     logging: console.log,
//   })
//   .then(function () {
//     console.log("Database is Synchronized!");
//   })
//   .catch(function (err) {
//     console.log(err, "Something went wrong with database sync!");
//   });

//#region API ROUTES
app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// routers
const {
  usersRouters,
  authGoogleRouters,
  authFacebookRouter,
  tenantRouter,
  propertyRouter,
  roomRouter,
  transactionRouter,
} = require("./routes");
app.use("/tenant", tenantRouter);
app.use("/users", usersRouters);
app.use("/auth/google", authGoogleRouters);
app.use("/auth/facebook", authFacebookRouter);
app.use("/property", propertyRouter);
app.use("/room", roomRouter);
app.use("/transaction", transactionRouter);

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

//Property image to FE
const path = require("path");
app.use("/image", express.static(path.join(__dirname, "../")));
// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
