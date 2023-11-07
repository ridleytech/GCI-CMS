const https = require("https");
const fs = require("fs");
var MongoClient = require("mongodb").MongoClient;
//const bodyParser = require("body-parser");
var dotenv = require("dotenv");

dotenv.config();
var mongoDB = process.env.mongodb;
var mongourl = process.env.mongouri;
var contactsTable = "contacts-prod";

const clearContacts = () => {
  MongoClient.connect(mongourl, function (err, db) {
    if (err) {
      console.log("connection err: " + err);
      throw err;
    }

    console.log("connected");

    var dbo = db.db(mongoDB);

    dbo.collection(contactsTable).deleteMany({}, function (err, result) {
      if (err) {
        console.log("err", err);
        throw err;
      }
      console.log("contacts deleted");

      db.close();
    });
  });
};

clearContacts();
