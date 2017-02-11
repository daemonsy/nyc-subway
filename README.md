# NYC Subway
![CircleCI](https://circleci.com/gh/daemonsy/nyc-subway/tree/master.svg?style=shield)

[NYC Subway](http://alexa.amazon.com/spa/index.html#skills/dp/B01MR1N9YH) is an Alexa Custom Skill that gives you an update on subway statuses.

![](nyc-subway-skill.png)

This repository contains code for the skill's lambda handler.

## What this does
This skill queries MTA's [Status API](http://web.mta.info/status/serviceStatus.txt) (more like a XML feed -_-) and responds with speech output depending on the utterance.

### Full update

> "Alexa, ask NY subway for an update | Alexa, open NYC subway"

This hits `fullStatusUpdate` which returns statuses on all lines, grouped by the issue type. For example:

> Alexa: The 123, ACE lines are undergoing service change. Good service on all other lines.

### Checking a specific line

> "Alexa, ask NY subway to check the NQR lines"

This hits `statusOfLine` which returns the status of the line group in question. It also adds a card with the issue details to your Alexa app.

> Alexa: The NQR line is undergoing service change. I've added a card with the details on the Alexa app.

## Development Workflow

- TDD a feature
- Let CircleCI run dem tests
- Merge to master
- It ships to AWS Lambda and publishes a version
- Point the `Production` alias to the version

## Dependencies

- [alexa-sdk](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) for the handler. It's awesome, makes it really easy to write a skill handler.
- [Isomorphic Fetch](https://github.com/matthew-andrews/isomorphic-fetch)
- [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) for parsing the MTA XML feed.
- [Lodash](https://github.com/lodash/lodash) is still a good swiss army knife that makes JS more fun.

## Testing

- [AVA](https://github.com/avajs/ava) allowed me to write/run tests in ES6 with just one package.
- [Lambda Tester](https://github.com/vandium-io/lambda-tester) is great for exercising the handlers and abstracting away ceremonies.
- [fetchMock](https://github.com/wheresrhys/fetch-mock) for mocking fetches in tests

To run tests, use `yarn test`

## Contributing
Feel free to implement any of the features on the [roadmap](https://github.com/daemonsy/nyc-subway/projects/1). If you wish to do something outside it, feel free to start an issue to discuss it.

Implement, write tests and PR it. I've left the utterances and intents so anyone can reproduce the skill.
