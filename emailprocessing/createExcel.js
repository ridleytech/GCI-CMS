// Require library
var excel = require("excel4node");
const fs = require("fs");

const parseCSV = (list) => {
  fs.readFile(`output/tests/${list}`, "utf8", (error, data) => {
    if (error) {
      console.log(error);
      return;
    }

    var propertyData = JSON.parse(data);

    // Create a new instance of a Workbook class
    var workbook = new excel.Workbook();

    // Add Worksheets to the workbook
    var worksheet = workbook.addWorksheet("Sheet 1");

    // Create a reusable style
    var style = workbook.createStyle({
      font: {
        color: "black",
        size: 12,
      },
      // numberFormat: "$#,##0.00; ($#,##0.00); -",
    });

    var styleHeader = workbook.createStyle({
      font: {
        color: "black",
        bold: true,
        size: 12,
      },

      // numberFormat: "$#,##0.00; ($#,##0.00); -",
    });

    worksheet.cell(1, 1).string("ID").style(styleHeader);
    worksheet.cell(1, 2).string("First Name").style(styleHeader);
    worksheet.cell(1, 3).string("Last Name").style(styleHeader);
    worksheet.cell(1, 4).string("Estimated Value").style(styleHeader);
    worksheet.cell(1, 5).string("Buyer Profit").style(styleHeader);
    worksheet.cell(1, 6).string("Wholesale Profit").style(styleHeader);
    worksheet.cell(1, 7).string("Offer Price").style(styleHeader);
    worksheet.cell(1, 8).string("URL").style(styleHeader);
    worksheet.cell(1, 9).string("Address").style(styleHeader);
    worksheet.cell(1, 10).string("City").style(styleHeader);
    worksheet.cell(1, 11).string("State").style(styleHeader);
    worksheet.cell(1, 12).string("Zip").style(styleHeader);
    worksheet.cell(1, 13).string("Cell1").style(styleHeader);
    worksheet.cell(1, 14).string("Email1").style(styleHeader);

    for (let i = 0; i < propertyData.length; i++) {
      const element = propertyData[i];

      // Set value of cell A1 to 100 as a number type styled with paramaters of style
      worksheet
        .cell(i + 2, 1)
        .number(element.id)
        .style(style);
      worksheet
        .cell(i + 2, 2)
        .string(element.firstName)
        .style(style);
      worksheet
        .cell(i + 2, 3)
        .string(element.lastName)
        .style(style);
      worksheet
        .cell(i + 2, 4)
        .number(element.estimatedValue)
        .style(style);
      worksheet
        .cell(i + 2, 5)
        .number(element.buyerProfit)
        .style(style);
      worksheet
        .cell(i + 2, 6)
        .number(element.wholesaleProfit)
        .style(style);
      worksheet
        .cell(i + 2, 7)
        .string(element.offerPrice)
        .style(style);
      worksheet
        .cell(i + 2, 8)
        .string(`https://app.propstream.com/search/${element.id}`)
        .style(style);
      worksheet
        .cell(i + 2, 9)
        .string(element.address)
        .style(style);
      worksheet
        .cell(i + 2, 10)
        .string(element.city)
        .style(style);
      worksheet
        .cell(i + 2, 11)
        .string(element.state)
        .style(style);
      worksheet
        .cell(i + 2, 12)
        .string(element.zip)
        .style(style);
      worksheet
        .cell(i + 2, 13)
        .string(element.cell1)
        .style(style);
      worksheet
        .cell(i + 2, 14)
        .string(element.email1)
        .style(style);

      // // Set value of cell B1 to 300 as a number type styled with paramaters of style
      // worksheet.cell(1, 2).number(200).style(style);

      // // Set value of cell C1 to a formula styled with paramaters of style
      // worksheet.cell(1, 3).formula("A1 + B1").style(style);
    }

    // Set value of cell A2 to 'string' styled with paramaters of style
    //   worksheet.cell(2, 1).string("string").style(style);

    workbook.write(`${list.split(".")[0]}-CC.xlsx`);

    console.log("done");

    //   console.log("propertyData", propertyData.length);
  });
};

var filePath = "HTX_Vacant_Out_of_State-email.json";
//filePath = "SkipTraced-HTX_Tax_Lien.csv";

parseCSV(filePath);
