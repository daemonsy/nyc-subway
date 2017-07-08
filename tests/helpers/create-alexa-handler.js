const Alexa = require('alexa-sdk');
const dynamoDBClient = require('./dynamo-db-client.js');
const uuidv4 = require('uuid/v4');

module.exports = function(handlers, tableName) {
  let allHandlers = Object.assign({}, handlers, { Unhandled: function() { this.emit(":tell", "Encountered an unhandled function") } });

  return (event, context, callback) => {
    var alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APPLICATION_ID;

    alexa.dynamoDBClient = dynamoDBClient;
    alexa.dynamoDBTableName = tableName;

    alexa.registerHandlers(allHandlers);
    alexa.execute();
  };
}
