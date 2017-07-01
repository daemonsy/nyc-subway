require('isomorphic-fetch');

const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");

var env = process.env.NODE_ENV || 'development';
const logRequests = process.env.LOG_REQUESTS === 'true';
const applicationId = process.env.APPLICATION_ID;

const _ = require('lodash');
const Alexa = require('alexa-sdk');

const statusToSpeech = require('./speech-helpers/status-to-speech.js');
const fetchMTAStatus = require('./services/fetch-mta-status.js');

// Handlers
const storeFavoriteLineHandler = require('./handlers/store-favorite-line.js');
const checkFavoriteLinesHandler = require('./handlers/check-favorite-lines.js');

// Utilities
const closestLineMatcher = require('./utilities/closest-line-matcher.js');
const withServiceIssues = require('./utilities/with-service-issues.js');

if(env === 'test') { require('dotenv').config(); };

const affectedServiceStatusesBuilder = (statuses) => {
  return _(statuses)
    .filter(withServiceIssues)
    .groupBy('status')
    .map((lines, status, collection) => {
      lines = lines.map(status => status.nameGroup);
      return statusToSpeech(lines, status);
    }).value();
};

var fullStatusUpdateHandler = function() {
  fetchMTAStatus(statuses => {
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
    var badQueryResponse = function() {
      self.emit(':tell', "Sorry, I didn't hear a subway line I understand");
    }

    if(nameGroup) {
      fetchMTAStatus(function(statuses) {
        let closestStatus = closestLineMatcher(statuses, 'nameGroup', nameGroup);

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
  storeFavoriteLine: storeFavoriteLineHandler,
  checkFavoriteLines: checkFavoriteLinesHandler,
  Unhandled: fullStatusUpdateHandler,
};

exports.flashBriefingHandler = (event, context, callback) => {
  fetchMTAStatus(statuses => {
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
