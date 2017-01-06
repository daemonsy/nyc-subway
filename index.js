if(process.env.NODE_ENV !== 'production') {
  var env = process.env.NODE_ENV || 'development';
  require('dotenv').load({ path: '.env.' + env });
}

require('isomorphic-fetch');

var applicationId = process.env.APPLICATION_ID;
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
      if(nameGroup.length > 1) {
        closestStatus = _.minBy(statuses, function(status) {
          return levenshtein.get(status.nameGroup, nameGroup.toUpperCase());
        });
      } else {
        closestStatus = _.find(statuses, function(status) {
          return status.nameGroup.search(nameGroup.toUpperCase()) !== -1;
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
      var notGoodService = function(status) { return status.status !== 'GOOD SERVICE' };

        var affectedServices = statuses
          .filter(notGoodService)
          .map(function(status) {
            return `<s>${statusToSpeech(status.nameGroup, status.status)}</s>`;
          });

      if(affectedServices.length === 0) {
        self.emit(':tell', 'Good service on all lines, what a rare day in NYC');
      } else {
        self.emit(':tell', affectedServices.join('\n'));
      }
    });
  },

  Unhandled: function() {
    this.emit(':tell', "Sorry I don't get your question");
  }
};

exports.handler = function(event, context, callback, fetch){
  var alexa = Alexa.handler(event, context);
  alexa.appId = applicationId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
