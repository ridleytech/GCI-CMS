var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;

const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const ClientCapability = require("twilio").jwt.ClientCapability;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dialRouter = require("./routes/dialer");
var smsRouter = require("./routes/sms");

var http = require("http");
var app = express();

var server = http.createServer(app);

// var io = require("socket.io")(server);
var io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", () => {
  console.log("io connected on port 3001");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/calls", dialRouter);
app.use("/sms", smsRouter);

app.post("/receive", function (req, res, next) {
  try {
    io.emit("callComing", { data: req.data });
    res.send({ sid: req.data });
  } catch (error) {
    res.send({ err: error });
  }
});

app.post("/twilioCall", function (req, res, next) {
  //  console.log("twilioCall body", req.body);

  io.emit("callComing", { data: req.body });

  const twiml = new VoiceResponse();
  twiml.say({ voice: "man", loop: 1000 }, "Thank you for calling The R");
  res.type("text/xml");
  res.send(twiml.toString());

  // res.send({ status: "hi twilio" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = { app, server };

// bodyCallComesIn = {
//   AccountSid: "AC1feb8c93dd05ee5c790948521f427b55",
//   ApiVersion: "2010-04-01",
//   CallSid: "CA64fac4428a7204d429686bd8219a284b",
//   CallStatus: "ringing",
//   CallToken:
//     "%7B%22parentCallInfoToken%22%3A%22eyJhbGciOiJFUzI1NiJ9.eyJjYWxsU2lkIjoiQ0E2NGZhYzQ0MjhhNzIwNGQ0Mjk2ODZiZDgyMTlhMjg0YiIsImZyb20iOiIrMTczNDg5MDE4MTAiLCJ0byI6IisxODMyNzg2MjY1NyIsImlhdCI6IjE2OTkzMTg4NzAifQ.47QVyGi1wn0JPYNh6s2zJpMiO3v3413rIulWsbkC39EqZjZswQJk1tOvMqd54SQvbltidVlo0whPNGgPCtDjlg%22%2C%22identityHeaderTokens%22%3A%5B%5D%7D",
//   Called: "+18327862657",
//   CalledCity: "",
//   CalledCountry: "US",
//   CalledState: "TX",
//   CalledZip: "",
//   Caller: "+17348901810",
//   CallerCity: "WAYNE",
//   CallerCountry: "US",
//   CallerState: "MI",
//   CallerZip: "48185",
//   Direction: "inbound",
//   From: "+17348901810",
//   FromCity: "WAYNE",
//   FromCountry: "US",
//   FromState: "MI",
//   FromZip: "48185",
//   StirVerstat: "TN-Validation-Passed-A",
//   To: "+18327862657",
//   ToCity: "",
//   ToCountry: "US",
//   ToState: "TX",
//   ToZip: "",
// };
// bodyCallStatusChanged = {
//   Called: "+18327862657",
//   ToState: "TX",
//   CallerCountry: "US",
//   Direction: "inbound",
//   Timestamp: "Tue, 07 Nov 2023 01:01:13 +0000",
//   CallbackSource: "call-progress-events",
//   CallerState: "MI",
//   ToZip: "",
//   SequenceNumber: "0",
//   To: "+18327862657",
//   CallSid: "CA64fac4428a7204d429686bd8219a284b",
//   ToCountry: "US",
//   CallerZip: "48185",
//   CalledZip: "",
//   ApiVersion: "2010-04-01",
//   CallStatus: "completed",
//   CalledCity: "",
//   Duration: "1",
//   From: "+17348901810",
//   CallDuration: "3",
//   AccountSid: "AC1feb8c93dd05ee5c790948521f427b55",
//   CalledCountry: "US",
//   CallerCity: "WAYNE",
//   ToCity: "",
//   FromCountry: "US",
//   Caller: "+17348901810",
//   FromCity: "WAYNE",
//   CalledState: "TX",
//   FromZip: "48185",
//   FromState: "MI",
// };
