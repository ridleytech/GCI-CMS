const fs = require("fs");
require("dotenv").config();

var file = "HTX_Vacant_Out_of_State";
var file2 = "HTX_Tax_Lien";

var path = `output/${file}-email.json`;
var path2 = `output/${file2}-email.json`;
//var path = "testUsers.json";

var hMap1 = {};
var hMap2 = {};
var users;
fs.readFile(path, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  users = JSON.parse(data);

  //console.log("users", users);

  // for (let i = 0; i < users.length; i++) {
  //   const element = users[i];

  //   if (!hMap1[element.email]) {
  //     hMap1[element.email] = element;
  //   }
  // }
});

fs.readFile(path2, "utf8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  var users2 = JSON.parse(data);

  // var diff = filterByReference(users, users2);
  // console.log("diff", diff);

  var dups = compareArrays(users, users2);
  console.log("dups", dups);

  // for (let i = 0; i < users2.length; i++) {
  //   const element = users2[i];

  //   if (!hMap2[element.email]) {
  //     hMap2[element.email] = element;
  //   }
  // }

  //console.log("hMap1", hMap1);

  // var ind = 1;

  // console.log("ind", hMap2[ind]);

  // for (const key in hMap1) {
  //   //console.log("key", key);
  //   if (Object.hasOwnProperty.call(hMap1, key)) {
  //     var char = key;

  //     console.log("char", char);

  //     if (Object.hasOwnProperty.call(hMap2, key2)) {
  //       console.log("hMap2", key2);
  //     }

  //     var status =
  //       hMap2[key] == char ? `has duplicate ${key}` : `new email ${key}`;

  //     console.log("status", status);
  //   }
  // }
});

const compareArrays = (arr1, arr2) => {
  var same = [];

  for (let i = 0; i < arr1.length; i++) {
    const element1 = arr1[i];

    for (let j = 0; j < arr2.length; j++) {
      const element2 = arr2[j];

      if (element1.email == element2.email) {
        same.push(element2);
      }
    }
  }

  return same;
};

const filterByReference = (arr1, arr2) => {
  let res = [];
  res = arr1.filter((el) => {
    return !arr2.find((element) => {
      return element.email === el.email;
    });
  });
  return res;
};

const filterBySame = (arr1, arr2) => {
  let res = [];
  res = arr1.filter((el) => {
    return arr2.find((element) => {
      return element.email === el.email;
    });
  });
  return res;
};
