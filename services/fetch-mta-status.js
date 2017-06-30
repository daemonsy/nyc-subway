const MTA_STATUS_URL = process.env.MTA_STATUS_URL;
const currentMTAStatus = require('../parsers/current-mta-status.js');

module.exports = function(callback) {
  return fetch(MTA_STATUS_URL)
    .then(response => response.text())
    .then(body => currentMTAStatus(body, callback));
};
