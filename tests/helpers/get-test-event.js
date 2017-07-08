const fs = require('fs');

module.exports = (eventName) => JSON.parse(
  fs.readFileSync(`${process.cwd()}/tests/fixtures/events/${eventName}.json`)
);
