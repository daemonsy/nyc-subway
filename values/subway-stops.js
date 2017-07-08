const fs = require('fs');
const _ = require('lodash');

module.exports = JSON.parse(fs.readFileSync(process.cwd() + '/data/subway-stops.json')).map(station =>
  _.transform(station, (result, value, key) => result[_.camelCase(key)] = value)
);
