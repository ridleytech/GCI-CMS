var express = require("express");
var router = express.Router();
var fs = require("fs");
var dotenv = require("dotenv");

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;

// console.log("accountSid", accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const { MessagingResponse } = require("twilio").twiml;
const bodyParser = require("body-parser");

router.post("/smsresponse", function (req, res, next) {
  //https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-node-js

  //const twiml = new MessagingResponse();

  console.log("someone text this number", req.body);

  var From = req.body.From;
  var Body = req.body.Body;
  var To = req.body.To;

  //this should go to the app instead of auto response below

  Body = "Response from Ava";

  var data = { body: { To: To, From: From, Body: Body } };

  sendMessage(data, res);

  // {
  //   ToCountry: 'US',
  //   ToState: 'TX',
  //   SmsMessageSid: 'SM034668469953ebd4861a84c5e9ef6ef5',
  //   NumMedia: '0',
  //   ToCity: '',
  //   FromZip: '48185',
  //   SmsSid: 'SM034668469953ebd4861a84c5e9ef6ef5',
  //   FromState: 'MI',
  //   SmsStatus: 'received',
  //   FromCity: 'WAYNE',
  //   Body: 'try response',
  //   FromCountry: 'US',
  //   To: '+18327862657',
  //   MessagingServiceSid: 'MG0618c35132ec56aa1927493ddfea5611',
  //   ToZip: '',
  //   NumSegments: '1',
  //   ReferralNumMedia: '0',
  //   MessageSid: 'SM034668469953ebd4861a84c5e9ef6ef5',
  //   AccountSid: 'AC1feb8c93dd05ee5c790948521f427b55',
  //   From: '+17348901810',
  //   ApiVersion: '2010-04-01'
  // }

  // twiml.message("The Robots are coming! Head for the hills!");

  // res.type("text/xml").send(twiml.toString());
});

router.post("/message", function (req, res, next) {
  //this captures message from app
  sendMessage(req, res);
});

const sendMessage = (req, res) => {
  client.messages
    .create({
      //body: "Test Twilio message",
      body: req.body.Body,
      from: req.body.To,
      //from: req.body.From,
      //to: "+17348901810",
      to: req.body.From,
    })
    .then((message) => {
      console.log("message response", message);
      res.send({ status: "message sent", message: message });
    })
    .catch(function (error) {
      console.log("msg error", error);
      res.send({ status: "message error", error: error });
    });
};

module.exports = router;
