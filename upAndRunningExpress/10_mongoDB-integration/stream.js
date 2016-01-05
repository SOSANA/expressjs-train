var fs = require('fs');

var inputFile = './users.json';
var outputFile = './out.json';

// creating read stream
var readable = fs.createReadStream(inputFile);

// creating our write stream (data written to it)
var writeable = fs.createWriteStream(outputFile);
readable.pipe(writeable);
