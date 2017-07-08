const AWS = require('aws-sdk');

module.exports = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  endpoint: "http://localhost:8000",
  region: "us-east-1"
});
