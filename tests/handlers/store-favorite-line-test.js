import fs from 'fs';
import test from 'ava';
import uuidv4 from "uuid/v4";

import LambdaTester from 'lambda-tester';
import fetchMock from 'fetch-mock';

import storeFavoriteLine from '../../handlers/store-favorite-line.js';
import createAlexaHandler from '../helpers/create-alexa-handler.js';

import dynamoDBClient from "../helpers/dynamo-db-client.js";

test.beforeEach(t => {
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));
});

test.afterEach(fetchMock.restore);

const readParams = function(tableName, event) {
  return {
    TableName: tableName,
    ConsistentRead: true,
    Key: {
      userId: {
        S: event.session.user.userId
      }
    }
  }
}
test.cb('handling "tell NYC subway to track the ACE train"', t => {
  t.plan(1);

  const event = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/store-favorite-line-ace.json'));
  const tableName = uuidv4();
  const alexaHandler = createAlexaHandler({ storeFavoriteLine }, tableName)

  LambdaTester(alexaHandler)
    .event(event)
    .expectSucceed(r => {
      setTimeout(() => {
        dynamoDBClient.getItem(readParams(tableName, event), (error, data) => {
          t.is(data.Item.mapAttr.M.trackedTrainLines.L[0].S, "ACE");
          t.end();
        });
      }, 100);
    });
});
