const fs = require("fs");
require("dotenv").config();

var file = "4135Bellefontaine";

var path = `data/${file}.json`;

console.log("path", path);

var liens;

fs.readFile(path, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  var dataJSON = JSON.parse(data);

  console.log("involuntaryLienAmount", dataJSON.involuntaryLienAmount);
  console.log("openMortgageBalance", dataJSON.openMortgageBalance);

  var liens = dataJSON.liens;
  console.log("liens", liens.length);

  var newLiens = removeDuplicates(liens);
  console.log("newLiens", newLiens.length);

  //   var lienMap = {};

  var lienTotal = newLiens.reduce(reduce, 0);

  console.log("lienTotal", lienTotal);
});

const reduce = (acc, item) => {
  return acc + item.amount;
};

function removeDuplicates(books) {
  // Create an array of objects

  // Declare a new array
  let newArray = [];

  // Declare an empty object
  let uniqueObject = {};

  // Loop for the array elements
  for (let i in books) {
    // Extract the title
    objTitle = books[i]["taxNumber"];

    // Use the title as the index
    uniqueObject[objTitle] = books[i];
  }

  // Loop to push unique object into array
  for (i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }

  // Display the unique objects
  //console.log(newArray);

  return newArray;
}
