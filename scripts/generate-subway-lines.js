const _ = require('lodash');

const subwayLines = [
  '1', '2', '3',
  '4', '5', '6',
  '7',
  'A', 'C', 'E',
  'N', 'Q', 'R', 'W',
  'B', 'D', 'F', 'M',
  'L', 'G',
  'S',
  'J', 'Z',
  'SIR'
];

const synonyms = {
  'A': ['alpha'],
  'C': ['charlie'],
  'E': ['echo'],
  'N': ['november'],
  'Q': ['quebec'],
  'R': ['romeo'],
  'W': ['whiskey'],
  'B': ['bravo'],
  'D': ['delta'],
  'F': ['foxtrot'],
  'M': ['mike'],
  'L': ['lima'],
  'G': ['golf'],
  'S': ['sierra', 'singapore'],
  'J': ['juliet'],
  'Z': ['zulu']
};

process.stdout.write(
  JSON.stringify(subwayLines.map(line => ({ id: line, name: { value: line, synonyms: synonyms[line] || [] }})))
);
