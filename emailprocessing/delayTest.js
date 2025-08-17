var playbackSpeed = 1000;
var isPlaying = false;

var notes = ["C", "E", "G"];

const delay = (t) => new Promise((resolve) => setTimeout(resolve, t));

const playNote = async (file) => {
  console.log("play audio", file);

  await delay(playbackSpeed);

  return file;
};

const prepareNotes = async (notes) => {
  const results = [];
  var ind = 0;

  // console.log("notes", notes);

  for (const file in notes) {
    if (results.length) {
      // var randDelay = getRandomInt(500, 5000);
      // var randDelay = playbackSpeed;

      console.log("stop audio", notes[ind]);

      //console.log("randDelay", randDelay);
      await delay(500);
      ind++;
    }

    const response = await playNote(notes[ind]);
    //console.log("response2", response2);
    results.push({ file, response });
  }

  return results;
};

const startNotes = () => {
  prepareNotes(notes).then((results) => {
    console.log("results", results);
    console.log("stop all audio");
    // results[0] = { file, response }  where file === file1
    // results[1] = { file, response }  where file === file2
    // ...
  });
};

startNotes();
