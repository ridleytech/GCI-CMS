const fs = require("fs");
require("dotenv").config();

const { updateContact } = require("./insertMongo");

var key = process.env.SENDGRID_API_KEY;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(key);

//console.log("key", key);

const sendBulkEmails = (list) => {
  //return;

  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(key);

  //return;

  var path = `output/${file}-email.json`;
  //var path = "testUsers.json";

  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    var users = JSON.parse(data);

    //   var user = users[0];
    //   console.log("user", user);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const msg = {
        to: user.email,
        from: {
          email: "gulfcoastinvestmentsgroup@gmail.com",
          name: user.sender,
        },
        subject: user.emailSubject,
        text: user.emailBody,
        html: user.htmlBody,
      };

      //console.log("msg", msg);

      return;

      sgMail
        .send(msg)
        .then(() => {
          console.log(`Email sent to ${user.email}`);

          updateContact(user);
        })
        .catch((error) => {
          console.error("email error", error);
        });
    }
  });
};

const sendEmail = (user) => {
  // console.log(`sendEmail to ${user.email1}`);

  const msg = {
    to: user.email1,
    from: {
      email: "gulfcoastinvestmentsgroup@gmail.com",
      name: user.sender,
    },
    subject: user.template.emailSubject,
    text: user.template.emailBody,
    html: user.template.htmlBody,
  };

  //console.log("msg", msg);

  const debugEmail = true;

  if (debugEmail == false) {
    sgMail
      .send(msg)
      .then(() => {
        console.log(`Email sent to ${user.email1}`);

        updateContact(user);
      })
      .catch((error) => {
        console.error("email error", error);
      });
  } else {
    updateContact(user);
  }
};

var file = "HTX_Tax_Lien";

//sendBulkEmails(file);

module.exports = { sendEmail };
