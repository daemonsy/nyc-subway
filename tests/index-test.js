import fs from 'fs';

import test from 'ava';
import LambdaTester from 'lambda-tester';
import fetchMock from 'fetch-mock';

import { handler } from '../index.js';

test('handling "ask subway status to check on the <subway-line> line?"', async t => {
  t.plan(1);

  const statusOfLineEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/status-of-line.json'));
  fetchMock.get(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  await LambdaTester(handler)
    .event(statusOfLineEvent)
    .expectSucceed(result => {
      t.is(result.response.outputSpeech.ssml, '<speak> The <say-as interpret-as="digits">ACE</say-as> line is experiencing delays </speak>');
    });

  fetchMock.reset();
})

test('handling "ask subway status for an update"', async t => {
  t.plan(3);

  const fullServiceUpdateEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/full-service-update.json'));
  fetchMock.get(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  await LambdaTester(handler)
    .event(fullServiceUpdateEvent)
    .expectSucceed(result => {
      let speechMarkup = result.response.outputSpeech.ssml;

      t.true(/ACE/.test(speechMarkup));
      t.false(/7/.test(speechMarkup));
      t.false(/L/.test(speechMarkup));
    });
});
