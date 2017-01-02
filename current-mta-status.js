var parseXML = require("xml2js").parseString

module.exports = function(mtaStatusXML, callback) {
  var statuses = {};

  parseXML(mtaStatusXML, function(error, results) {
    results.service.subway[0].line.forEach(function(line) {
      names = line.name[0].split('');
      names.forEach(function(name) {
        statuses[name.toLowerCase()] = {
          status: line.status[0],
          updated: line["Date"][0] + " " + line["Time"],
          description: line.text[0]
        }
      })
    });
    callback(statuses);
  });
}
