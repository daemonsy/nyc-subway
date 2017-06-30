const parseXML = require('xml2js').parseString;
const serviceDetailsCleaner = require('./service-details-cleaner');

module.exports = function(mtaStatusXML, callback) {
  parseXML(mtaStatusXML, { normalize: true, trim: true }, function(error, results) {

    callback(
      results.service.subway[0].line.map(function(line) {
        return {
          nameGroup: line.name[0].toUpperCase(),
          status: line.status[0],
          updated: line["Date"][0] + " " + line["Time"],
          description: serviceDetailsCleaner(line.text[0])
        }
      })
    );
  });
}
