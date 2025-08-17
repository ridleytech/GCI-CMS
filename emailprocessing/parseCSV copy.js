const fs = require("fs");
const csv = require("csv-parser");

const { firstContact, initialOffer } = require("./emailTemplates");

const parseCSV = (list) => {
  var users = [];

  fs.createReadStream(list)
    .pipe(csv())
    .on("data", function (data) {
      try {
        //console.log("Name is: " + data["First Name"]);

        var sender = "Randall R";
        var senderPhone = "(281) 886-3924";
        var propertyType = list.toLowerCase().includes("vacant")
          ? "Vacant"
          : "Lien";

        var firstName = data["First Name"];
        var lastName = data["Last Name"];
        var email1 = data["Email 1"];
        var email2 = data["Email 2"];
        var email3 = data["Email 3"];
        var email4 = data["Email 4"];

        var cell1 = data["Cell"];
        var cell2 = data["Cell 2"];
        var cell3 = data["Cell 3"];
        var cell4 = data["Cell 4"];

        var dnc1 = data["DNCC"];
        var dnc2 = data["DNCC 2"];
        var dnc3 = data["DNCC 3"];
        var dnc4 = data["DNCC 4"];

        //var phone = cell1;

        //var fullName = `${firstName} ${lastName}`;

        var address = data["Street Address"];
        var city = data["City"];
        var state = data["State"];
        var zip = data["Zip"];

        //console.log("fullName: " + fullName);

        //var fullAddress = `${address} ${city}, ${state} ${zip}`;
        //console.log("address: " + address);

        var offerPrice = 10000;

        fs.readFile(path, "utf8", (error, data) => {
          if (error) {
            console.log(error);
            return;
          }

          var users = JSON.parse(data);

          const template = initialOffer(
            address,
            city,
            state,
            firstName,
            senderPhone,
            sender,
            offerPrice
          );

          //console.log("fc", template);

          // var emailSubject = `Investor interested in buy your house at ${address} in ${city}, ${state}`;
          // var emailBody = `Hello ${firstName},
          // My name is ${
          //   sender.split(" ")[0]
          // } and I'm an investor interested in buying your house at ${address} in ${city}, ${state}.
          // I'd like to make a cash offer for the house as-is.
          // Please feel free to respond by email or give me a call at ${senderPhone}.

          // Thank you,
          // ${sender}`;

          // var htmlBody = `<div>Hello ${firstName},<br><br>
          // My name is ${
          //   sender.split(" ")[0]
          // } and I'm an investor interested in buying your house at ${address} in ${city}, ${state}. I'd like to make a cash offer for the house as-is.<br><br>
          // Please feel free to respond by email or give me a call at ${senderPhone}.<br>
          // <br>
          // Thank you,<br><br>
          // ${sender}</div>`;

          var user = {
            firstName,
            lastName,
            propertyType,
            address,
            city,
            state,
            zip,
            email1,
            email2,
            email3,
            email4,
            cell1,
            cell2,
            cell3,
            cell4,
            dnc1,
            dnc2,
            dnc3,
            dnc4,
            // emailSubject,
            // emailBody,
            htmlBody: template.htmlBody,
            sender,
            // date: Date.now(),
            // formatted: formatted_date(),
            // date: 1695910396422,
            // formatted: "2023/9/28 9:13:16 422",
            date: 1695843045134,
            formatted: "2023/9/27 14:30:45 134",
            contactedDates: [
              {
                // date: Date.now(),
                // formatted: formatted_date(),
                // date: 1695910396422,
                // formatted: "2023/9/28 9:13:16 422",
                date: 1695843045134,
                formatted: "2023/9/27 14:30:45 134",
                responded: "",
                contactType: "email",
                email: email1,
                emailSubject: template.emailSubject,
                emailBody: template.emailBody,
                htmlBody: template.htmlBody,
              },
            ],
          };

          // date: Date.now(),
          // formatted: formatted_date(),

          //lien

          // "date": 1695910396422,
          // "formatted": "2023/9/28 9:13:16 422"

          //vacant
          // "date": 1695843045134,
          // "formatted": "2023/9/27 14:30:45 134"

          //console.log("user: " + JSON.stringify(user));

          users.push(user);
        });

        //perform the operation
      } catch (err) {
        //error handler

        console.log("e", err);
      }
    })
    .on("end", function () {
      //some final operation

      console.log("users", users.length);

      if (users.length == 0) {
        return;
      }

      // var usersWithEmails = users.filter((user) => {
      //   return user.email;
      // });

      var usersWithEmails = users.filter((user) => {
        return user.email1 || user.email2 || user.email3 || user.email4;
      });

      console.log("usersWithEmails", usersWithEmails.length);

      createHTML(usersWithEmails, list);

      fs.writeFile(
        `output/tests/${list.split("-")[1].split(".")[0]}-email.json`,
        JSON.stringify(usersWithEmails),
        () => {
          console.log("json file saved");
        }
      );
    });

  const createHTML = (users, filePath) => {
    console.log("filePath", filePath);
    let htmlPath = `output/html/tests/${filePath.split("-")[1].split(".")[0]}`;
    console.log("htmlPath", htmlPath);
    if (!fs.existsSync(htmlPath)) {
      fs.mkdirSync(htmlPath);
    }

    console.log(htmlPath);

    for (let i = 0; i < users.length; i++) {
      const element = users[i];

      //console.log("write", element);

      fs.writeFile(
        `${htmlPath}/${element.address}.html`,
        element.htmlBody,
        () => {
          //console.log("html file saved");
        }
      );
    }
  };

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
};

const calculateOffer = () => {};

var filePath = "SkipTraced-HTX_Vacant_Out_of_State.csv";
//filePath = "SkipTraced-HTX_Tax_Lien.csv";

parseCSV(filePath);
