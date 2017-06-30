const fetchMTAStatus = require('../services/fetch-mta-status.js');

const closestLineMatcher = require('../utilities/closest-line-matcher.js');
const literalize = require('../speech-helpers/literalize.js');

module.exports = function(alexa) {
  let heardNameGroup = this.event.request.intent.slots.subwayLineOrGroup.value;

  if(!heardNameGroup) { this.emit(':tell', "Sorry, I didn't hear a subway line or group I recognized") };

  fetchMTAStatus(statuses => {
    let closestLine = closestLineMatcher(statuses, 'nameGroup', heardNameGroup);

    this.attributes["trackedTrainLines"] = (this.attributes["trackedTrainLines"] || []).concat([closestLine]);

    this.emit(':tell', `Your favorite line is ${literalize(closestLine.nameGroup)}`);
  });
}
