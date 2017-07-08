const subwayStops = require('../values/subway-stops.js');
const _ = require('lodash');

process.stdout.write(
  JSON.stringify(
    _(subwayStops)
      .map(stopData => stopData["stopName"])
      .uniq()
      .map(stopName => ({ id: null, name: { value: stopName, synonyms: [] }}))
      .value()
  )
);
