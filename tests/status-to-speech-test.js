import test from 'ava';

import statusToSpeech  from '../status-to-speech.js';

test('Given a service status, it builds the right speech"', t => {
  t.is(statusToSpeech('A', 'GOOD SERVICE'),
    'Good service on the A line, yay!'
  );

  t.is(statusToSpeech('N', 'DELAYS'),
    'Oh no, the N line is experiencing delays'
  );

  t.is(statusToSpeech('Q', 'PLANNED WORK'),
    'The Q line is undergoing planned work, allow extra time traveling'
  );

  t.is(statusToSpeech('1', 'SERVICE CHANGE'),
    'There is a service change on the 1 line currently'
  );
})

test('Given an unknown service status, it builds a generic speech output', t => {
  t.is(statusToSpeech('F', 'MTA TROLLING US'),
    'The status of the F line is mta trolling us'
  );
});

test('Give a status with different casing, it builds the right speech output', t => {
  t.is(statusToSpeech('B', 'delays'),
    'Oh no, the B line is experiencing delays'
  );
});
