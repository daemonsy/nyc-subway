const Alexa = require('alexa-sdk');
const dynamoDBClient = require('./dynamo-db-client.js');

module.exports = function(handlers, tableName) {
  return (event, context, callback) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APPLICATION_ID;

    alexa.dynamoDBClient = dynamoDBClient;
    alexa.dynamoDBTableName = tableName;

    alexa.registerHandlers(handlers);
    alexa.execute();
  };
}
