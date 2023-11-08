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
  twiml.dial().number();
  res.type("text/xml");

  console.log("twiml.toString()", twiml.toString());
  res.send(twiml.toString());
});

router.post("/clientOutbound", function (req, res, next) {
  // console.log("clientOutbound/", req.body);
  // var recordCall = false;
  const to = req.body.to;
  const from = req.body.from;

  console.log("to", to);
  console.log("from", from);

  const twiml = new VoiceResponse();
  const dial = twiml.dial({ callerId: from });
  dial.number(to);

  res.type("text/xml");
  res.send(twiml.toString());
});

function isNumber(to) {
  if (to.length == 1) {
    if (!isNaN(to)) {
      console.log("It is a 1 digit long number" + to);
      return true;
    }
  } else if (String(to).charAt(0) == "+") {
    number = to.substring(1);
    if (!isNaN(number)) {
      console.log("It is a number " + to);
      return true;
    }
  } else {
    if (!isNaN(to)) {
      console.log("It is a number " + to);
      return true;
    }
  }
  console.log("not a number");
  return false;
}

module.exports = router;
