const fs = require('fs');
const path = require('path');

// Absolute, OS-safe path to the sample file.
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1: Read the whole file into memory ────────────────────────────────
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory at once`);
  });
}

// ── PART 2: Stream the file and copy it ────────────────────────────────────
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  writable.on('finish', () => {
    console.log(
      'stream: finished copying via 64KB chunks (peak memory stays flat)'
    );
  });

  readable.pipe(writable);
}

// ── PART 3: Explanation ───────────────────────────────────────────────────
// fs.readFile loads the entire file into memory at once, so memory usage grows
// with the size of the file. A stream processes the file in smaller chunks,
// so peak memory stays relatively low even when the file is very large.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };