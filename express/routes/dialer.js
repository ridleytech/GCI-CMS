var express = require("express");
var router = express.Router();
// var fs = require("fs");
var dotenv = require("dotenv");

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;

// console.log("accountSid", accountSid);
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const VoiceResponse = require("twilio").twiml.VoiceResponse;
// const ClientCapability = require("twilio").jwt.ClientCapability;

/* GET users listing. */

router.post("/getToken", function (req, res, next) {
  // console.log("token", req.body);
  const clientName = req.body.clientName;
  // https://www.twilio.com/docs/iam/access-tokens#create-an-access-token-for-voice
  const AccessToken = require("twilio").jwt.AccessToken;
  const VoiceGrant = AccessToken.VoiceGrant;

  // Used when generating any kind of tokens
  // To set up environmental variables, see http://twil.io/secure
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_API_SECRET;

  // console.log("twilioAccountSid", twilioAccountSid);
  // console.log("twilioApiKey", twilioApiKey);
  // console.log("twilioApiSecret", twilioApiSecret);

  // Used specifically for creating Chat tokens
  // const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID;
  const outgoingApplicationSid = "AP6f3ad2f8534024cae19ee779b95a6e5f";
  const identity = clientName;
  // console.log("outgoingApplicationSid", outgoingApplicationSid);

  // Create a "grant" which enables a client to use Chat as a given user,
  // on a given device
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    incomingAllow: true, // Optional: add to allow incoming calls
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity }
  );

  token.addGrant(voiceGrant);

  // Serialize the token to a JWT string
  // console.log("new token", token.toJwt());

  // res.set("Content-Type", "application/jwt");
  // res.send({ token: token.toJwt(), orig: token });
  res.send({ token: token.toJwt(), orig: token });
});

router.post("/answerCall", function (req, res, next) {
  //agent presses answer call in UI

  // console.log("answerCall", req.body);

  const callSid = req.body.data.CallSid;
  const clientName = req.body.clientName;

  // const answerStatus = req.body.answerStatus;
  // console.log("answerCall sid", callSid);
  // console.log("answerStatus", answerStatus);

  var recordCall = false;

  try {
    const updateStuff = client.calls(callSid).update(
      {
        record: recordCall,
        url: `https://2286-2601-2c1-c101-c90-cde8-f24c-fb12-b4a7.ngrok-free.app/calls/routeCall?clientName=${clientName}`,
        method: "post",
      },
      (err, call) => {
        if (err) {
          console.log("err", err);
        }
        // console.log("call", call);
      }
    );

    console.log("updateStuff", updateStuff);
  } catch (error) {
    res.send({ err: error });
  }
});

router.post("/routeCall", function (req, res, next) {
  // console.log("routeCall", req);
  const clientName = req.query.clientName;
  // console.log("routeCall clientName", clientName);

  const twiml = new VoiceResponse();
  twiml.dial().client(clientName);
  res.type("text/xml");

  console.log("twiml.toString()", twiml.toString());
  res.send(twiml.toString());
});

router.post("/clientCall", function (req, res, next) {
  var recordCall = false;

  try {
    client.calls
      .create({
        record: recordCall,
        url: "http://demo.twilio.com/docs/classic.mp3",
        to: "+17348901810",
        from: "+18327862657",
      })
      .then((call) => {
        console.log(call.sid);
        res.send({ sid: call.sid });
      });
  } catch (error) {
    res.send({ err: error });
  }
});

module.exports = router;

// router.post("/twilioCall", function (req, res, next) {
//   bodyCallComesIn = {
//     AccountSid: "AC1feb8c93dd05ee5c790948521f427b55",
//     ApiVersion: "2010-04-01",
//     CallSid: "CA64fac4428a7204d429686bd8219a284b",
//     CallStatus: "ringing",
//     CallToken:
//       "%7B%22parentCallInfoToken%22%3A%22eyJhbGciOiJFUzI1NiJ9.eyJjYWxsU2lkIjoiQ0E2NGZhYzQ0MjhhNzIwNGQ0Mjk2ODZiZDgyMTlhMjg0YiIsImZyb20iOiIrMTczNDg5MDE4MTAiLCJ0byI6IisxODMyNzg2MjY1NyIsImlhdCI6IjE2OTkzMTg4NzAifQ.47QVyGi1wn0JPYNh6s2zJpMiO3v3413rIulWsbkC39EqZjZswQJk1tOvMqd54SQvbltidVlo0whPNGgPCtDjlg%22%2C%22identityHeaderTokens%22%3A%5B%5D%7D",
//     Called: "+18327862657",
//     CalledCity: "",
//     CalledCountry: "US",
//     CalledState: "TX",
//     CalledZip: "",
//     Caller: "+17348901810",
//     CallerCity: "WAYNE",
//     CallerCountry: "US",
//     CallerState: "MI",
//     CallerZip: "48185",
//     Direction: "inbound",
//     From: "+17348901810",
//     FromCity: "WAYNE",
//     FromCountry: "US",
//     FromState: "MI",
//     FromZip: "48185",
//     StirVerstat: "TN-Validation-Passed-A",
//     To: "+18327862657",
//     ToCity: "",
//     ToCountry: "US",
//     ToState: "TX",
//     ToZip: "",
//   };
//   bodyCallStatusChanged = {
//     Called: "+18327862657",
//     ToState: "TX",
//     CallerCountry: "US",
//     Direction: "inbound",
//     Timestamp: "Tue, 07 Nov 2023 01:01:13 +0000",
//     CallbackSource: "call-progress-events",
//     CallerState: "MI",
//     ToZip: "",
//     SequenceNumber: "0",
//     To: "+18327862657",
//     CallSid: "CA64fac4428a7204d429686bd8219a284b",
//     ToCountry: "US",
//     CallerZip: "48185",
//     CalledZip: "",
//     ApiVersion: "2010-04-01",
//     CallStatus: "completed",
//     CalledCity: "",
//     Duration: "1",
//     From: "+17348901810",
//     CallDuration: "3",
//     AccountSid: "AC1feb8c93dd05ee5c790948521f427b55",
//     CalledCountry: "US",
//     CallerCity: "WAYNE",
//     ToCity: "",
//     FromCountry: "US",
//     Caller: "+17348901810",
//     FromCity: "WAYNE",
//     CalledState: "TX",
//     FromZip: "48185",
//     FromState: "MI",
//   };

//   console.log("twilioCall body", req.body);

//   const twiml = new VoiceResponse();
//   twiml.say({ voice: "man", loop: 1000 }, "Thank you for calling The R");
//   res.type("text/xml");
//   res.send(twiml.toString());

//   // res.send({ status: "hi twilio" });
// });
