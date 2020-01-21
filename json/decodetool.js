const Decoder = require('../decoder');
const fs = require('fs');

const buf = fs.readFileSync('./decode-temp', 'binary');
const json = new Decoder(Buffer.from(buf, 'base64')).parse();
fs.writeFileSync('./decode-result.json', JSON.stringify(json, null, '\t'));