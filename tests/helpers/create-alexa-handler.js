const Alexa = require('alexa-sdk');
const dynamoDBClient = require('./dynamo-db-client.js');

module.exports = function(handlers) {
  return (event, context, callback) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APPLICATION_ID;

    alexa.dynamoDBClient = dynamoDBClient;
    alexa.dynamoDBTableName = 'nyc-subway-test';

    alexa.registerHandlers(handlers);
    alexa.execute();
  };
}
