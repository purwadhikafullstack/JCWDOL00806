const { join } = require("path");
require('dotenv').config({path:join(__dirname,'../.env')});
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const passportGoogle = require("./auth/passportGoogle");
const passportFacebook = require("./auth/passportFacebook");
const cron = require("node-cron");
const { bookingReminder } = require("./middleware/bookingReminder");
const { createProxyMiddleware } = require('http-proxy-middleware');

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
    origin: `${process.env.WEBSITE_URL}`,
  })
);

// Set up proxy for the RajaOngkir API
app.use('/api/rajaongkir', createProxyMiddleware({
  target: 'https://api.rajaongkir.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/rajaongkir': '/starter/city',
  },
  headers: {
    key: process.env.RAJAONGKIR_KEY,
  },
}));

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

//setup cron scheduler to send email reminder and run bookingReminder everyday at 00:00am
cron.schedule("0 0 * * *", bookingReminder);

// Sequelize DB Sync

// const Sequelize = require("sequelize");
// const Models = require("./models");
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
  salesRouter,
} = require("./routes");
app.use("/api/tenant", tenantRouter);
app.use("/api/users", usersRouters);
app.use("/api/auth/google", authGoogleRouters);
app.use("/api/auth/facebook", authFacebookRouter);
app.use("/api/property", propertyRouter);
app.use("/api/room", roomRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/sales", salesRouter);

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
    console.error("Error : ", err.message);
    res.status(err.status).send(err);
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
app.use("/image/src", express.static(path.join(__dirname, "./")));
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
