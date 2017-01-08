import test from 'ava';

import statusToSpeech  from '../status-to-speech.js';

test('Given a service status, it builds the right speech"', t => {
  t.plan(4);

  t.is(statusToSpeech('A', 'GOOD SERVICE'),
    'Good service on the <say-as interpret-as="spell-out">A</say-as> line'
  );

  t.is(statusToSpeech('N', 'DELAYS'),
    'The <say-as interpret-as="spell-out">N</say-as> line is experiencing delays'
  );

  t.is(statusToSpeech('Q', 'PLANNED WORK'),
    'The <say-as interpret-as="spell-out">Q</say-as> line is undergoing planned work'
  );

  t.is(statusToSpeech('1', 'SERVICE CHANGE'),
    'The <say-as interpret-as="spell-out">1</say-as> line is undergoing service change'
  );
})

test('Given multiple service statuses, it builds gramatically correct speech output', t => {
  t.plan(4);

  t.is(statusToSpeech(['ACE', '456'], 'GOOD SERVICE'),
    'Good service on the <say-as interpret-as="spell-out">ACE, 456</say-as> lines'
  );

  t.is(statusToSpeech(['NQR', 'BDFM'], 'DELAYS'),
    'The <say-as interpret-as="spell-out">NQR, BDFM</say-as> lines are experiencing delays'
  );

  t.is(statusToSpeech(['123', '456'], 'PLANNED WORK'),
    'The <say-as interpret-as="spell-out">123, 456</say-as> lines are undergoing planned work'
  );

  t.is(statusToSpeech(['7', 'ACE'], 'SERVICE CHANGE'),
    'The <say-as interpret-as="spell-out">7, ACE</say-as> lines are undergoing service change'
  );
});

test('Given an unknown service status, it builds a generic speech output', t => {
  t.plan(1);

  t.is(statusToSpeech('F', 'MTA TROLLING US'),
    'The status of the <say-as interpret-as="spell-out">F</say-as> line is mta trolling us'
  );
});

test('Give a status with different casing, it builds the right speech output', t => {
  t.plan(1);

  t.is(statusToSpeech('B', 'delays'),
    'The <say-as interpret-as="spell-out">B</say-as> line is experiencing delays'
  );
});
