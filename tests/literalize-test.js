import test from 'ava';

import literalize from "../speech-helpers/literalize.js";

test('literalize adds dashes across a speech token', t => {
  t.is(literalize("ACE"), "A-C-E");
});
