import fs from 'fs';
import test from 'ava';

import LambdaTester from 'lambda-tester';
import fetchMock from 'fetch-mock';

import storeFavoriteLine from '../../handlers/store-favorite-line.js';
import createAlexaHandler from '../helpers/create-alexa-handler.js';

import dynamoDBClient from "../helpers/dynamo-db-client.js";

test.cb('handling "tell NYC subway to track the ACE train"', t => {
  t.plan(0);

  const event = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/store-favorite-line-ace.json'));
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  const alexaHandler = createAlexaHandler({ storeFavoriteLine })

  LambdaTester(alexaHandler)
    .event(event)
    .expectSucceed(r => {
      t.end();
      fetchMock.restore();
    });
});
