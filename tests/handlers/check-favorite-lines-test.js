import fs from 'fs';
import test from 'ava';

import LambdaTester from 'lambda-tester';

import checkFavoriteLines from '../../handlers/check-favorite-lines.js';
import createAlexaHandler from '../helpers/create-alexa-handler.js';

test(`handling "what's on my watchlist?"`, async t => {
  t.plan(1);

  const event = JSON.parse(fs.readFileSync(process.cwd() + '/tests/fixtures/events/check-favorite-lines.json'));
  const alexaHandler = createAlexaHandler({ checkFavoriteLines })

  const result = await LambdaTester(alexaHandler)
    .event(event)
    .expectSucceed(r => r);

  t.true(result.response.outputSpeech.ssml.includes(`You're watching the A-C-E, L, 4-5-6, B-D-F-M, G, 1-2-3 trains`));
});
