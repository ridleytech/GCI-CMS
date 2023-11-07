const https = require("https");
const fs = require("fs");
var MongoClient = require("mongodb").MongoClient;
//const bodyParser = require("body-parser");
var dotenv = require("dotenv");

dotenv.config();
var mongoDB = process.env.mongodb;
var mongourl = process.env.mongouri;
var contactsTable = "contacts-prod";

var testItem = {
  _id: {
    $oid: "65187a7d364b108e2248e911",
  },
  firstName: "Joan",
  lastName: "Alksnis",
  propertyType: "Vacant",
  address: "16021 Diana Ln",
  city: "Houston",
  state: "TX",
  zip: "77062",
  email1: "JALKSNIS@MAILCITY.COM",
  email2: "JALKSNIS@CABLEONE.NET",
  email3: "",
  email4: "",
  cell1: "2816204686",
  cell2: "",
  cell3: "",
  cell4: "",
  dnc1: "DNC",
  dnc2: "test",
  dnc3: "",
  dnc4: "",
  htmlBody:
    "<div>Hello Joan,<br><br>\nMy name is Randall and I'm an investor interested in buying your house at 16021 Diana Ln in Houston, TX. I'd like to make a cash offer for the house as-is.<br><br>\nPlease feel free to respond by email or give me a call at (281) 886-3924.<br>\n<br>\nThank you,<br><br>\nRandall R</div>",
  sender: "Randall R",
  date: 1695843045134,
  formatted: "2023/9/27 14:30:45 134",
  contactedDates: [
    {
      date: 1695843045134,
      formatted: "2023/9/27 14:30:45 134",
      responded: "",
      contactType: "email",
      email: "JALKSNIS@MAILCITY.COM",
      emailSubject:
        "Investor interested in buy your house at 16021 Diana Ln in Houston, TX",
      emailBody:
        "Hello Joan,\nMy name is Randall and I'm an investor interested in buying your house at 16021 Diana Ln in Houston, TX.\nI'd like to make a cash offer for the house as-is.\nPlease feel free to respond by email or give me a call at (281) 886-3924.\n\nThank you,\nRandall R",
      htmlBody:
        "<div>Hello Joan,<br><br>\nMy name is Randall and I'm an investor interested in buying your house at 16021 Diana Ln in Houston, TX. I'd like to make a cash offer for the house as-is.<br><br>\nPlease feel free to respond by email or give me a call at (281) 886-3924.<br>\n<br>\nThank you,<br><br>\nRandall R</div>",
    },
  ],
};

var testContactItem = {
  date: 1695843045134,
  formatted: "2023/9/27 14:30:45 134",
  responded: "",
  contactType: "email",
  email: "JALKSNIS@MAILCITY.COM",
  emailSubject:
    "Investor interested in buy your house at 16021 Diana Ln in Houston, TX",
  emailBody:
    "Hello Joan,\nMy name is Randall and I'm an investor interested in buying your house at 16021 Diana Ln in Houston, TX.\nI'd like to make a cash offer for the house as-is.\nPlease feel free to respond by email or give me a call at (281) 886-3924.\n\nThank you,\nRandall R",
  htmlBody:
    "<div>Hello Joan,<br><br>\nMy name is Randall and I'm an investor interested in buying your house at 16021 Diana Ln in Houston, TX. I'd like to make a cash offer for the house as-is.<br><br>\nPlease feel free to respond by email or give me a call at (281) 886-3924.<br>\n<br>\nThank you,<br><br>\nRandall R</div>",
};

const insertContactsFromList = (list) => {
  //console.log("mongourl", mongourl);

  var path = `output/${file}-email.json`;

  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      console.log("error reading file", error);
      return;
    }

    var users = JSON.parse(data);

    //console.log("users", users.length);

    MongoClient.connect(mongourl, function (err, db) {
      if (err) {
        console.log("connection err: " + err);
        throw err;
      }

      //console.log("connected");

      var dbo = db.db(mongoDB);

      dbo.collection(contactsTable).insertMany(users, function (err, result) {
        if (err) {
          console.log("err", err);
          throw err;
        }
        console.log("contacts inserted");

        db.close();
      });
    });
  });
};

function addContactedEntry(address) {
  //var data = req.body;

  MongoClient.connect(mongourl, function (err, db) {
    if (err) {
      //console.log("err: " + err);

      throw err;
    }

    var dbo = db.db(mongoDB);
    //var query = { date: 1695843045134 };
    var query = { address: address };

    var newvalues = { $push: { contactedDates: testContactItem } };

    dbo
      .collection(contactsTable)
      .update(query, newvalues, function (err, result) {
        if (err) {
          console.log("update err", err);
          throw err;
        }

        console.log("result: " + JSON.stringify(result));
        //console.log("result: " + result.length);
        //console.log("userid: " + data.userid + " view updated");
        // if (result.modifiedCount == 0) {
        //   console.log("do a contact insert");
        // } else {
        //   console.log("contact updated");
        // }

        db.close();
      });
  });
}

function updateContact(user) {
  //var data = req.body;

  // console.log("updateContact");

  MongoClient.connect(mongourl, function (err, db) {
    if (err) {
      //console.log("err: " + err);
      throw err;
    }

    const contactedItem = {
      // date: 1695843045134,
      // formatted: "2023/9/27 14:30:45 134",
      date: Date.now(),
      formatted: formatted_date(),
      responded: "",
      contactType: "email",
      email: user.email1,
      emailSubject: user.template.emailSubject,
      emailBody: user.template.emailBody,
      htmlBody: user.template.htmlBody,
    };

    //var address = "16021 Diana Ln";

    var dbo = db.db(mongoDB);
    var query = { address: user.address };
    var newvalues = { $push: { contactedDates: contactedItem } };

    dbo
      .collection(contactsTable)
      .updateMany(query, newvalues, function (err, result) {
        if (err) {
          console.log("update err", err);
          throw err;
        }

        // console.log("result: " + JSON.stringify(result));
        //console.log("result: " + result.length);
        //console.log("userid: " + data.userid + " view updated");
        if (result.modifiedCount == 0) {
          // console.log("do a contact insert");

          delete user.template;

          user.contactedDates = [contactedItem];

          //insertContact(user);

          dbo.collection(contactsTable).insertOne(user, function (err, result) {
            if (err) {
              console.log("err", err);
              //db.close();
              throw err;
            }
            // console.log("contact inserted");
            db.close();
          });
        } else {
          // console.log("contact updated");
          db.close();
        }
      });
  });
}

const insertContact = (contact) => {
  console.log("insertContact");
  //console.log("contact",contact);

  MongoClient.connect(mongourl, function (err, db) {
    if (err) {
      console.log("connection err: " + err);
      db.close();
      throw err;
    }

    var dbo = db.db(mongoDB);

    dbo.collection(contactsTable).insertOne(contact, function (err, result) {
      if (err) {
        console.log("err", err);
        db.close();
        throw err;
      }
      console.log("contact inserted");
    });

    db.close();
  });
};

//clearContacts();

var file = "HTX_Vacant_Out_of_State";
file = "HTX_Tax_Lien";

//insertContacts(file);

// updateContact({
//   id: 1833617204,
//   estimatedValue: 313303,
//   buyerProfit: 203646.95,
//   rehabCost: 36255,
//   wholesaleProfit: 10000,
//   offerPrice: "157,391.95",
//   squareFeet: 2417,
//   firstName: "Joan",
//   lastName: "Alksnis",
//   propertyType: "Vacant",
//   address: "16021 Diana Ln",
//   city: "Houston",
//   state: "TX",
//   zip: "77062",
//   email1: "JALKSNIS@MAILCITY.COM",
//   email2: "JALKSNIS@CABLEONE.NET",
//   email3: "",
//   email4: "",
//   cell1: "2816204686",
//   cell2: "",
//   cell3: "",
//   cell4: "",
//   dnc1: "DNC",
//   dnc2: "",
//   dnc3: "",
//   dnc4: "",
//   sender: "Randall R",
//   date: 1695843045134,
//   formatted: "2023/9/27 14:30:45 134",
//   template: {
//     emailSubject:
//       "Attached is my offer to buy your house at 16021 Diana Ln in Houston, TX",
//     emailBody:
//       "Hello Joan,\n  I wanted to follow up on my last email with my cash offer to buy your house at 16021 Diana Ln in Houston, TX.\n\n  My cash offer is $157,391.95 as-is.\n\n  Please feel free to respond by email or give me a call at (281) 886-3924 to discuss the deal.\n  \n  Thank you,\n  Randall R",
//     htmlBody:
//       "<div>Hello Joan,<br><br>\n    I wanted to follow up on my last email with my cash offer to buy your house at 16021 Diana Ln in Houston, TX.<br><br>\n    My cash offer is $157,391.95 as-is.<br><br>\n  Please feel free to respond by email or give me a call at (281) 886-3924 to discuss the deal.<br>\n  <br>\n  Thank you,<br><br>\n  Randall R</div>",
//   },
// });

function formatted_date() {
  var result = "";
  var d = new Date();
  result +=
    d.getFullYear() +
    "/" +
    (d.getMonth() + 1) +
    "/" +
    d.getDate() +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds() +
    " " +
    d.getMilliseconds();
  return result;
}

//var address = "16021 Diana Ln";
//addContactedEntry(address);
module.exports = { updateContact };
