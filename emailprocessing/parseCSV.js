const fs = require("fs");
const csv = require("csv-parser");

const { firstContact, initialOffer } = require("./emailTemplates");
const { sendEmail } = require("./sendEmails");

const parseCSV = (list) => {
  var users = [];

  fs.readFile("data/merged.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    var propertyData = JSON.parse(data);
    // console.log("propertyData", propertyData);

    var i = 0;

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

          const currentPropData = propertyData.filter((prop) => {
            // if (prop.address.streetAddress == "3925 Mckinley St") {
            //   console.log("streetAddress: " + prop.address.streetAddress);
            //   console.log("cityName: " + prop.address.cityName);
            //   console.log("stateCode: " + prop.address.stateCode);
            //   console.log("zip: " + prop.address.zip);
            // }

            return (
              prop.address.streetAddress.toLowerCase() ==
                address.toLowerCase() &&
              prop.address.cityName.toLowerCase() == city.toLowerCase() &&
              prop.address.stateCode.toLowerCase() == state.toLowerCase() &&
              prop.address.zip.toLowerCase() == zip.toLowerCase()
            );
          })[0];

          //console.log("currentPropData", currentPropData);
          var offerPrice;
          var rehabCost = 0;

          const options = {
            style: "decimal", // Other options: 'currency', 'percent', etc.
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          };

          if (currentPropData) {
            var wholesaleProfit = 10000;
            var buyerProfit = currentPropData.estimatedValue * 0.65;
            //rehabCost = currentPropData.squareFeet * 15;

            offerPrice = (
              buyerProfit -
              rehabCost -
              wholesaleProfit
            ).toLocaleString("en-US", options);

            console.log(
              address +
                " assessed: " +
                currentPropData.estimatedValue.toLocaleString(
                  "en-US",
                  options
                ) +
                " offerPrice",
              offerPrice
            );

            if (parseFloat(offerPrice) < 0) {
              console.log("negative", {
                estimatedValue: currentPropData.estimatedValue,
                squareFeet: currentPropData.squareFeet,
                buyerProfit,
                rehabCost,
                wholesaleProfit,
                offerPrice,
              });
            }
          } else {
            console.log("no offer price for " + address);

            // console.log("no offer price for " + address, {
            //   estimatedValue: currentPropData.estimatedValue,
            //   squareFeet: currentPropData.squareFeet,
            //   buyerProfit,
            //   rehabCost,
            //   wholesaleProfit,
            //   offerPrice,
            // });

            offerPrice = "N/A";
            rehabCost = "N/A";
          }

          if (offerPrice != "N/A") {
            const template = initialOffer(
              address,
              city,
              state,
              firstName,
              senderPhone,
              sender,
              offerPrice
            );

            var user = {
              id: currentPropData.id,
              estimatedValue: currentPropData.estimatedValue,
              buyerProfit,
              rehabCost,
              wholesaleProfit,
              offerPrice,
              squareFeet: currentPropData.squareFeet,
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
              //htmlBody: template.htmlBody,
              sender,
              // date: Date.now(),
              // formatted: formatted_date(),
              // date: 1695910396422,
              // formatted: "2023/9/28 9:13:16 422",
              // date: 1695843045134,
              // formatted: "2023/9/27 14:30:45 134",
              template,
              // contactedDates: [
              //   {
              //     // date: Date.now(),
              //     // formatted: formatted_date(),
              //     // date: 1695910396422,
              //     // formatted: "2023/9/28 9:13:16 422",
              //     date: 1695843045134,
              //     formatted: "2023/9/27 14:30:45 134",
              //     responded: "",
              //     contactType: "email",
              //     email: email1,
              //     emailSubject: template.emailSubject,
              //     emailBody: template.emailBody,
              //     htmlBody: template.htmlBody,
              //   },
              // ],
            };

            users.push(user);
          }

          i++;

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

        for (let i = 0; i < usersWithEmails.length; i++) {
          const user = usersWithEmails[i];
          sendEmail(user);
        }

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
      let htmlPath = `output/html/tests/${
        filePath.split("-")[1].split(".")[0]
      }`;
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
          element.template.htmlBody,
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
    //console.log("propertyData", propertyData);
  });
};

const calculateOffer = () => {};

var filePath = "SkipTraced-HTX_Vacant_Out_of_State.csv";
//filePath = "SkipTraced-HTX_Tax_Lien.csv";

parseCSV(filePath);
