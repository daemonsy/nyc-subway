var parseXML = require("xml2js").parseString

module.exports = function(mtaStatusXML, callback) {
  parseXML(mtaStatusXML, function(error, results) {
    callback(
      results.service.subway[0].line.map(function(line) {
        return {
          nameGroup: line.name[0].toLowerCase(),
          status: line.status[0],
          updated: line["Date"][0] + " " + line["Time"],
          description: line.text[0]
        }
      })
    );
  });
}
