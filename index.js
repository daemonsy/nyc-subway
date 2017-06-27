require('isomorphic-fetch');

const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");

var env = process.env.NODE_ENV || 'development';
const logRequests = process.env.LOG_REQUESTS === 'true';

if(env !== 'production') {
  require('dotenv').load({ path: '.env.' + env });
}

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

const affectedServiceStatusesBuilder = (statuses) => {
  let notGoodService = status => status.status !== 'GOOD SERVICE';

  let affectedServices = statuses
    .filter(notGoodService)

  return _(affectedServices)
    .groupBy('status')
    .map((lines, status, collection) => {
      lines = lines.map(status => status.nameGroup);
      return statusToSpeech(lines, status);
    }).value();
};

var fullStatusUpdateHandler = function() {
  fetchStatus(statuses => {
    let affectedServiceStatuses = affectedServiceStatusesBuilder(statuses);

    if(affectedServiceStatuses.length === 0) {
      this.emit(':tell', 'Good service on all lines, what a rare day in NYC');
    } else {
      affectedServiceStatuses.push('Good service on all other lines. ');
      this.emit(':tell', affectedServiceStatuses.join('\n'));
    }
  });
};

var handlers = {
  statusOfLine: function () {
    var self = this;
    var nameGroup = self.event.request.intent.slots.subwayLineOrGroup.value;
    var closestStatus = null;
    var badQueryResponse = function() {
      self.emit(':tell', "Sorry, I didn't hear a subway line I understand");
    }

    if(nameGroup) {
      fetchStatus(function(statuses) {
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
          if(closestStatus.description) {
            var serviceStatus = `${statusToSpeech(closestStatus.nameGroup, closestStatus.status)}I've added a card with the details on the Alexa App.`
            self.emit(':tellWithCard', serviceStatus, `Subway Status for ${closestStatus.nameGroup}`, closestStatus.description);
          } else {
            self.emit(':tell', statusToSpeech(closestStatus.nameGroup, closestStatus.status));
          }
        } else {
          badQueryResponse();
        }
      });
    } else {
      badQueryResponse();
    }
  },

  fullStatusUpdate: fullStatusUpdateHandler,
  Unhandled: fullStatusUpdateHandler
};

exports.flashBriefingHandler = (event, context, callback) => {
  fetchStatus(statuses => {
    let affectedServiceStatuses = affectedServiceStatusesBuilder(statuses);
    let message;

    if(affectedServiceStatuses.length === 0) {
      message = 'Good service on all lines, what a rare day in NYC';
    } else {
      affectedServiceStatuses.push('Good service on all other lines. ')
      message = affectedServiceStatuses.join("");
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        uid: uuidv4(),
        titleText: "Current NYC Subway Status",
        mainText: message,
        redirectionUrl: "http://www.mta.info/mta-service-status-widget",
        updateDate: new Date().toISOString()
      })
    });
  });
};

exports.handler = function(event, context, callback){
  if(logRequests) {
    console.log(event.request); // Log to Cloudwatch
  }

  var alexa = Alexa.handler(event, context);
  alexa.appId = applicationId;

  if(env === 'test') {
    alexa.dynamoDBClient = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      endpoint: "http://localhost:8000",
      region: "us-east-1"
    });
  }

  alexa.dynamoDBTableName = `nyc-subway-${env}`;

  alexa.registerHandlers(handlers);
  alexa.execute();
};
