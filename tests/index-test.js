import fs from 'fs';
import { spawn } from 'child_process';

import test from 'ava';
import LambdaTester from 'lambda-tester';
import fetchMock from 'fetch-mock';

import { handler, flashBriefingHandler } from '../index.js';

var dynamo;

test.cb.before(t => {
  dynamo = spawn('yarn run dynamodb:start', { shell: true, timeout: 3000 });
  setTimeout(t.end, 3000);
})

test.cb.after.always(t => {
  dynamo.on('exit', () => t.end());
  setTimeout(t.end, 3000);
  dynamo.kill('SIGINT');
})

test.serial('flashBriefingHandler', async t => {
  t.plan(3);

  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  const result = await LambdaTester(flashBriefingHandler)
    .event({})
    .expectResult(r => r);

  let response = JSON.parse(result.body);

  t.is(response.titleText, "Current NYC Subway Status");
  t.true(!!response.mainText.match("The A-C-E line is experiencing delays. "));
  t.true(!!response.mainText.match("Good service on all other lines. "));
});

test.serial('handling "ask subway status to check on the <subway-line> line?" and the service is not good', async t => {
  t.plan(3);

  const statusOfLineEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/status-of-line.json'));
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  const result = await LambdaTester(handler)
    .event(statusOfLineEvent)
    .expectSucceed(r => r);

  t.is(result.response.outputSpeech.ssml, `<speak> The A-C-E line is experiencing delays. I've added a card with the details on the Alexa App. </speak>`);
  t.is(result.response.card.title, 'Subway Status for ACE');
  t.true(/Due to an earlier incident at 23 St/.test(result.response.card.content));

  fetchMock.restore();
});

test.serial('handling "ask subway status to check on the <subway-line> line?" and the service the service is good', async t => {
  t.plan(2);

  const statusOfLineEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/status-of-line.json'));
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  statusOfLineEvent.request.intent.slots.subwayLineOrGroup.value = '456'; // Fixture has good service on 456

  const result = await LambdaTester(handler)
    .event(statusOfLineEvent)
    .expectSucceed(r => r);

  t.is(result.response.outputSpeech.ssml, '<speak> Good service on the 4-5-6 line.  </speak>');
  t.is(result.response.card, undefined);

  fetchMock.restore();
});

test.serial('handling "ask subway status to check on the <subway-line> line?" without a valid slot value', async t => {
  t.plan(1);

  const statusOfLineEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/bad-status-of-line-without-value.json'));
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  const result = await LambdaTester(handler)
    .event(statusOfLineEvent)
    .expectSucceed(r => r);

  t.is(result.response.outputSpeech.ssml, "<speak> Sorry, I didn't hear a subway line I understand </speak>");

  fetchMock.restore();
});

test.serial('handling "ask subway status for an update and there are bad services"', async t => {
  t.plan(3);

  const fullServiceUpdateEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/full-service-update.json'));
  fetchMock.once(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status.xml', 'utf-8'));

  const result = await LambdaTester(handler)
    .event(fullServiceUpdateEvent)
    .expectSucceed(r => r);

  let speechMarkup = result.response.outputSpeech.ssml;
  t.true(speechMarkup.search("1-2-3, B-D-F-M, J-Z, N-Q-R") !== -1);
  t.true(speechMarkup.search('A-C-E') !== -1);
  t.true(speechMarkup.search('Good service on all other lines. ') !== -1);

  fetchMock.restore();
});

test.serial('handling "ask subway status for an update and all services are good"', async t => {
  t.plan(1);

  const fullServiceUpdateEvent = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/full-service-update.json'));
  fetchMock.get(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status-all-good.xml', 'utf-8'));
  const result = await LambdaTester(handler)
    .event(fullServiceUpdateEvent)
    .expectSucceed(r => r);

  let speechMarkup = result.response.outputSpeech.ssml;

  t.true(/Good service on all lines/.test(speechMarkup));

  fetchMock.restore();
});

test.serial('handling "open subway status"', async t => {
  t.plan(1);

  const launchRequst = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/launch-request.json'));
  fetchMock.get(process.env.MTA_STATUS_URL, fs.readFileSync(process.cwd() + '/tests/fixtures/mta-status-all-good.xml', 'utf-8'));
  const result = await LambdaTester(handler)
    .event(launchRequst)
    .expectSucceed(r => r);

  let speechMarkup = result.response.outputSpeech.ssml;

  t.true(/Good service on all lines/.test(speechMarkup));

  fetchMock.restore();
});



