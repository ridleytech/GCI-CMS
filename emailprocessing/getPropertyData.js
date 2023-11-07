const fs = require("fs");
const fetch = require("node-fetch");

const getPropertyData = () => {
  console.log("gpd");
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const saveFile = async (file) => {
  //console.log("upload file", file);

  var myHeaders = new fetch.Headers();
  myHeaders.append(
    "Cookie",
    "_gcl_au=1.1.1479341122.1695927761; hubspotutk=8f8550d4e77344663731e40d2d306979; __hssrc=1; _fbp=fb.1.1695927762308.613158416; _gid=GA1.2.1208220776.1696594239; __hstc=250975257.8f8550d4e77344663731e40d2d306979.1695927762106.1696594237906.1696598250477.6; _gat_gtag_UA_116041265_1=1; _ga_N15NEVP20F=GS1.1.1696598251.6.0.1696598251.60.0.0; JSESSIONID=waRc8udEPAy8MaEN0QwSdP-BNH7g-kPF8D1JCato.ip-10-202-20-197-propstream-server; _gat=1; __hssc=250975257.3.1696598250477; _ga_Z1SBZD3N71=GS1.1.1696598248.7.1.1696598285.0.0.0; _ga=GA1.2.95712536.1695927730; AWSALBTG=XrGNxYo+W2xrpA5jeMy/zVB9ImIcBqQezjSGWCdANaq2Tgjb2TD0CUCRdYw0Ekaufj7Cu0EqBIQfpsacsgOLeFg96gYRfN9ZI9zlBlLplgMR01NU75fdl3fr/M55F9PACVewx6hgG5zwXcKpImOdXRkYAaxSwJhqJ+f5Q/yUlqmmyUwcew0=; AWSALBTGCORS=XrGNxYo+W2xrpA5jeMy/zVB9ImIcBqQezjSGWCdANaq2Tgjb2TD0CUCRdYw0Ekaufj7Cu0EqBIQfpsacsgOLeFg96gYRfN9ZI9zlBlLplgMR01NU75fdl3fr/M55F9PACVewx6hgG5zwXcKpImOdXRkYAaxSwJhqJ+f5Q/yUlqmmyUwcew0="
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  await fetch(
    `https://app.propstream.com/eqbackend/resource/auth/ps4/property/${file}?m=F`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
      var data = JSON.parse(result);
      //console.log("result", data.marketValue);

      //console.log("return", { id: file + "hello", response: data.marketValue });

      fs.writeFile(`data/propertyData/${file}.json`, result, async () => {
        console.log("json file saved: " + file);
      });

      return { id: file, response: data };
    })
    .catch((error) => {
      console.log("error", error);
      return { id: file, data: "save error" };
    });

  //console.log("return end");
};

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

const uploadAll = async (files) => {
  const results = [];
  var ind = 0;

  console.log("files", files);

  for (const file in files) {
    if (results.length) {
      var randDelay = getRandomInt(500, 5000);
      //console.log("randDelay", randDelay);
      await delay(randDelay); // 1 second
      ind++;
    }

    const response2 = await saveFile(files[ind]);
    //console.log("response2", response2);
    results.push({ file, response2 });
  }

  return results;
};

var ids = [
  1834532888, 1833556373, 1833677451, 1833610546, 1834637253, 1834608169,
  1833797652, 1833787183, 1833562776, 1834165005, 1833648240, 1833602996,
  1833430414, 1834121665, 1834143730, 1834143185, 1833682623, 1834434389,
  1834490237, 1833721783, 1832575601, 1834574332, 1834544956, 1834270945,
  1833452470, 1834445470, 1833430893, 1833891993, 1834305896, 1833496945,
  1834154318, 1833497136, 1833483551, 1833730083, 1834434797, 1834385964,
  1833733257, 1834568464, 1833613825, 1834318901, 1833604303, 1833651187,
  1833669118, 1833762234, 1833658326, 1832553759, 1833617204, 1832497961,
  1833540728, 1833787514, 1833757019, 1833646692, 1834277795, 1834311641,
  1834277260, 1834277802, 1833814969, 1834524825, 1834559230, 1834179610,
  1834400461, 1834477478, 1834265670, 1834129162, 1834345514, 1834501532,
  1834018048, 1834247705, 1834502065, 1834348391, 1834426319, 1834069742,
  1833651982, 1834452904, 1834206978, 1834040248, 1834309749, 1834493905,
  1834409816, 1834309340, 1834288128, 1834192726, 1833595382, 1834126126,
  1833630237, 1833630239, 1833561998, 1834426031, 1833527798, 1834159182,
  1834443612, 1834156595, 1834267248, 1834232221, 1833392768, 1834170172,
  1833686966, 1834514715, 1834495705, 1833675133, 1833581190, 1834469434,
  1833432898, 1834373958, 1833788199, 1833778601, 1833711462, 1834402090,
  1833536746, 1833659058, 1833410491, 1834413929, 1834617466, 1833406461,
  1833478016, 1833423163, 1834386492, 1833711511, 1833682286, 1833659893,
  1834399456, 1833615163, 1833807066, 1834628086, 1834093607, 1833839431,
  1834167952, 1833959399, 1834795595, 1834355344, 1834085864,
];

uploadAll(ids).then((results) => {
  console.log("results", results);
  // results[0] = { file, response }  where file === file1
  // results[1] = { file, response }  where file === file2
  // ...

  //   fs.writeFile(
  //     `data/propertyData/${results[0].file}.json`,
  //     results[0].response,
  //     async () => {
  //       console.log("json file saved");
  //     }
  //   );
});
