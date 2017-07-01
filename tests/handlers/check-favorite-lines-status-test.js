import fs from 'fs';
import test from 'ava';

import LambdaTester from 'lambda-tester';
import fetchMock from 'fetch-mock';

import checkFavoriteLinesStatus from '../../handlers/check-favorite-lines-status.js';
import createAlexaHandler from '../helpers/create-alexa-handler.js';

test.beforeEach(t => {
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));
})

test.afterEach(fetchMock.restore);

test(`handling "to check my commute"`, async t => {
  t.plan(2);

  const event = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/check-favorite-lines-status.json'));
  const alexaHandler = createAlexaHandler({ checkFavoriteLinesStatus })

  const result = await LambdaTester(alexaHandler)
    .event(event)
    .expectSucceed(r => r);

  t.true(result.response.outputSpeech.ssml.includes(`A-C-E line is experiencing delays`));
  t.true(result.response.outputSpeech.ssml.includes(`N-Q-R line is undergoing planned work`));
});
