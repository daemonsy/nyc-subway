require('isomorphic-fetch');

if(process.env.NODE_ENV !== 'production') {
  var env = process.env.NODE_ENV || 'development';
  require('dotenv').load({ path: '.env.' + env });
}
var mtaStatusURL = process.env.MTA_STATUS_URL;

var Alexa = require('alexa-sdk');
var currentMTAStatus = require('./current-mta-status.js');
var statusToSpeech = require('./status-to-speech.js');

var handlers = {
  statusOfLine: function () {
    var self = this;
    var lineGroup = self.event.request.intent.slots.subwayLineOrGroup.value;

    fetch(mtaStatusURL).then(function(response) {
      return response.text()
    }).then(function(body) {
      currentMTAStatus(body, function(statuses) {
        var validStatus = statuses[lineGroup.toLowerCase()];
        if(validStatus) {
          self.emit(':tell', statusToSpeech(lineGroup, validStatus.status));
        } else {
          self.emit(':tell', "I didn't hear a subway line I understand");
        }
      });
    }).catch(function(error) { console.log(error) });
  },

  fullStatusUpdate: function() {

  },

  Unhandled: function() {
    this.emit(':tell', "Sorry I don't get your question");
  }
};

exports.handler = function(event, context, callback, fetch){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
