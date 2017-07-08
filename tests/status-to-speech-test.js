import test from 'ava';

import statusToSpeech  from '../speech-helpers/status-to-speech.js';

test('Given a service status, it builds the right speech"', t => {
  t.plan(4);

  t.is(statusToSpeech('A', 'GOOD SERVICE'),
    'Good service on the A line. '
  );

  t.is(statusToSpeech('N', 'DELAYS'),
    'The N line is experiencing delays. '
  );

  t.is(statusToSpeech('Q', 'PLANNED WORK'),
    'The Q line is undergoing planned work. '
  );

  t.is(statusToSpeech('1', 'SERVICE CHANGE'),
    'The 1 line is undergoing service change. '
  );
})

test('Given multiple service statuses, it builds gramatically correct speech output', t => {
  t.plan(4);

  t.is(statusToSpeech(['ACE', '456'], 'GOOD SERVICE'),
    'Good service on the A-C-E, 4-5-6 lines. '
  );

  t.is(statusToSpeech(['NQR', 'BDFM'], 'DELAYS'),
    'The N-Q-R, B-D-F-M lines are experiencing delays. '
  );

  t.is(statusToSpeech(['123', '456'], 'PLANNED WORK'),
    'The 1-2-3, 4-5-6 lines are undergoing planned work. '
  );

  t.is(statusToSpeech(['7', 'ACE'], 'SERVICE CHANGE'),
    'The 7, A-C-E lines are undergoing service change. '
  );
});

test('Given an unknown service status, it builds a generic speech output', t => {
  t.plan(1);

  t.is(statusToSpeech('F', 'MTA TROLLING US'),
    'The status of the F line is mta trolling us. '
  );
});

test('Give a status with different casing, it builds the right speech output', t => {
  t.plan(1);

  t.is(statusToSpeech('B', 'delays'),
    'The B line is experiencing delays. '
  );
});
