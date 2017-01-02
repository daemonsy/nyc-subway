var Alexa = require('alexa-sdk');
var currentMTAStatus = require('./current-mta-status.js');
var fetch = require('node-fetch');

var handlers = {
  statusOfLine: function () {
    var context = this;
    var lineGroup = this.event.request.intent.slots.subwayLineOrGroup.value;

    var mtaStatusXML = fetch('http://web.mta.info/status/serviceStatus.txt').then(function(response) {
      return response.text()
    }).then(function(body) {
      currentMTAStatus(body, function(statuses) {
        var validStatus = statuses[lineGroup.toLowerCase()];
        if(validStatus) {
          context.emit(':tell', 'The status of ' + lineGroup + ' is ' + validStatus.status);
        } else {
          context.emit(':tell', "I didn't hear a subway line I understand");
        }
      });
    });
  },

  Unhandled: function() {
    this.emit(':tell', "Sorry I don't get your question");
  }
};

exports.alexaHandlers = handlers;

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
