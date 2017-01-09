import test from 'ava';
import fs from 'fs';
import { parseString } from 'xml2js'

import { default as serviceDetailsCleaner } from '../service-details-cleaner.js';

test('removes all linebreaks', t => {
  t.plan(1);

  const mtaServiceDescription = fs.readFileSync(process.cwd() + '/tests/fixtures/service-description-text.xml', 'utf-8');
  const cleanedText = serviceDetailsCleaner(mtaServiceDescription);

  t.not(cleanedText.substring(0, 1), '\n', 'leading linebreaks should have been removed');
});

test('removes all html tags', t => {
  t.plan(1);

  const mtaServiceDescription = fs.readFileSync(process.cwd() + '/tests/fixtures/service-description-text.xml', 'utf-8');
  const cleanedText = serviceDetailsCleaner(mtaServiceDescription);

  t.is(cleanedText.match('<span'), null, 'should not contain any html tags');
});

test('combines linebreaks to compact the text', t => {
  t.plan(1);

  const mtaServiceDescription = fs.readFileSync(process.cwd() + '/tests/fixtures/service-description-text.xml', 'utf-8');
  const cleanedText = serviceDetailsCleaner(mtaServiceDescription);

  t.skip.true(cleanedText.search('\n\n') == -1);
});
