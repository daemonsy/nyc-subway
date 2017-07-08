import test from 'ava';

import LambdaTester from 'lambda-tester';
import getTestEvent from '../helpers/get-test-event.js';

import storeCommute from '../../handlers/store-commute.js';
import createAlexaHandler from '../helpers/create-alexa-handler.js';

test(`Handling the start of the dialog`, async t => {
  t.plan(1);

  const event = getTestEvent('store-commute-start');
  const alexaHandler = createAlexaHandler({ storeCommute });

  const result = await LambdaTester(alexaHandler)
    .event(event)
    .expectSucceed(r => r);

  t.is(result.response.directives[0].type, "Dialog.Delegate")
});

test(`collecting subwayLine and a valid input is given`, async t => {
  t.plan(1);

  const event = getTestEvent('store-commute-subway-line');
  const alexaHandler = createAlexaHandler({ storeCommute });

  const result = await LambdaTester(alexaHandler)
    .event(event)
    .expectSucceed(r => r);

  t.is(result.response.directives[0].type, "Dialog.Delegate");
});
