var express = require("express");
var router = express.Router();
var fs = require("fs");

var {
  firstContact,
  initialOffer,
} = require("../../emailprocessing/emailTemplates2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  let ob = {
    users: ["Randall", "Ava"],
  };
  res.send(ob);
});

router.get("/templates", function (req, res, next) {
  let templates = [firstContact, initialOffer];
  res.send(templates);
});

module.exports = router;
