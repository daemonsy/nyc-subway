require('isomorphic-fetch');


if(process.env.NODE_ENV !== 'production') {
  var env = process.env.NODE_ENV || 'development';
  require('dotenv').load({ path: '.env.' + env });
}
var mtaStatusURL = process.env.MTA_STATUS_URL;

var _ = require('lodash');
var levenshtein = require('fast-levenshtein');
var Alexa = require('alexa-sdk');
var currentMTAStatus = require('./current-mta-status.js');
var statusToSpeech = require('./status-to-speech.js');

var fetchStatus = function(callback) {
  return fetch(mtaStatusURL).then(function(response) {
    return response.text()
  }).then(function(body) {
    currentMTAStatus(body, callback);
  });
};

var handlers = {
  statusOfLine: function () {
    var self = this;
    var nameGroup = self.event.request.intent.slots.subwayLineOrGroup.value;

    fetchStatus(function(statuses) {
      var closestStatus;
      if(nameGroup.length >1) {
        closestStatus = _.minBy(statuses, function(status) {
          return levenshtein.get(status.nameGroup, nameGroup.toLowerCase());
        });
      } else {
        closestStatus = _.find(statuses, function(status) {
          return status.nameGroup.search(nameGroup.toLowerCase()) !== -1;
        });
      }

      if(closestStatus) {
        self.emit(':tell', statusToSpeech(closestStatus.nameGroup, closestStatus.status));
      } else {
        self.emit(':tell', "I didn't hear a subway line I understand");
      }
    });
  },

  fullStatusUpdate: function() {
    var self = this;
    fetchStatus(function(statuses) {
      var isGoodService = function(status) { status.status === 'Good Service' };

      self.emit(':tell', _.chain(statuses)
        .omit(isGoodService)
        .map(function(status) {
          return `<s>${statusToSpeech(status.nameGroup, status.status)}</s>`;
        }).join('\n'));
    });
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
