import test from 'ava';

import statusToSpeech  from '../status-to-speech.js';

test('Given a service status, it builds the right speech"', t => {
  t.is(statusToSpeech('A', 'GOOD SERVICE'),
    'Good service on the <say-as interpret-as="digits">A</say-as> line'
  );

  t.is(statusToSpeech('N', 'DELAYS'),
    'The <say-as interpret-as="digits">N</say-as> line is experiencing delays'
  );

  t.is(statusToSpeech('Q', 'PLANNED WORK'),
    'The <say-as interpret-as="digits">Q</say-as> line is undergoing planned work'
  );

  t.is(statusToSpeech('1', 'SERVICE CHANGE'),
    'There is a service change on the <say-as interpret-as="digits">1</say-as> line currently'
  );
})

test('Given an unknown service status, it builds a generic speech output', t => {
  t.is(statusToSpeech('F', 'MTA TROLLING US'),
    'The status of the <say-as interpret-as="digits">F</say-as> line is mta trolling us'
  );
});

test('Give a status with different casing, it builds the right speech output', t => {
  t.is(statusToSpeech('B', 'delays'),
    'The <say-as interpret-as="digits">B</say-as> line is experiencing delays'
  );
});
