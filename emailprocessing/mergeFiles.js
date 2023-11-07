var jsonConcat = require("json-concat");
// jsonConcat(
//   {
//     src: "data/propertyData/",
//     dest: "data/propertyDataMerge.json",
//   },
//   function (json) {
//     //console.log(json);
//     console.log("json done");
//   }
// );

var fs = require("fs");
var path = require("path");
// In newer Node.js versions where process is already global this isn't necessary.
var process = require("process");

var moveFrom = "data/propertyData/";
var jsonData = [];

// Loop through all the files in the temp directory
fs.readdir(moveFrom, function (err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  var ind = 0;

  files.forEach(function (file, index) {
    // Make one pass and make the file complete
    var fromPath = path.join(moveFrom, file);

    //console.log("fromPath", fromPath);
    //var toPath = path.join(moveTo, file);

    fs.readFile(fromPath, "utf8", (error, data) => {
      if (error) {
        console.log(error);
        return;
      }

      var data = JSON.parse(data);

      //console.log("push");

      jsonData.push(data);

      ind++;

      if (ind == 131) {
        fs.writeFile(`data/merged.json`, JSON.stringify(jsonData), async () => {
          console.log("json file saved");
        });
      }
      //console.log("data", data);
    });

    // fs.stat(fromPath, function (error, stat) {
    //   if (error) {
    //     console.error("Error stating file.", error);
    //     return;
    //   }

    //   if (stat.isFile()) console.log("'%s' is a file.", fromPath);
    //   else if (stat.isDirectory())
    //     console.log("'%s' is a directory.", fromPath);

    //   fs.rename(fromPath, toPath, function (error) {
    //     if (error) {
    //       console.error("File moving error.", error);
    //     } else {
    //       console.log("Moved file '%s' to '%s'.", fromPath, toPath);
    //     }
    //   });
    // });
  });

  //   fs.writeFile(`data/merged.json`, JSON.stringify(jsonData), async () => {
  //     console.log("json file saved");
  //   });
});
