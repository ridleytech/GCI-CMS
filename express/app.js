var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const VoiceResponse = require("twilio").twiml.VoiceResponse;

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

app.post("/twilioCall", async function (req, res, next) {
  // console.log("twilioCall body", req.body);

  if (req.body.To == "+18327862657" && CallStatus == "ringing") {
    io.emit("callComing", { data: req.body });

    const twiml = new VoiceResponse();
    twiml.say({ voice: "man", loop: 1000 }, "Thank you for calling The R");
    res.type("text/xml");
    res.send(twiml.toString());
  } else if (
    req.body.CallStatus == "ringing" &&
    req.body.Caller.includes("client:")
  ) {
    const to = req.body.To;
    const from = "+18327862657";

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `http://localhost:3001/calls/clientOutbound`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { to: to, from: from },
    };

    const xml = await axios
      .request(config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("clientOutbound error:", error);
      });

    // console.log("xml", xml);
    res.type("text/xml");
    res.send(xml.toString());
  }
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
