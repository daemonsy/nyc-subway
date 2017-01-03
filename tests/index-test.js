import fs from 'fs';

import test from 'ava';
import LambdaTester from 'lambda-tester';
import fetchMock from 'fetch-mock';

import { handler } from '../index.js';

test('handling "what is the status of <subway-line> line?"', async t => {
  t.plan(1);

  const event = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/status-of-line.json'));
  fetchMock.get(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  await LambdaTester(handler)
    .event(event)
    .expectSucceed(result => {
      t.is(result.response.outputSpeech.ssml, '<speak> Oh no, the <say-as interpret-as="digits">A</say-as> line is experiencing delays </speak>');
    });

  fetchMock.reset();
})
