const fetchMTAStatus = require('../services/fetch-mta-status.js');
const closestLineMatcher = require('../utilities/closest-line-matcher.js');

module.exports = function() {
  let heardNameGroup = this.event.request.intent.slots.subwayLineOrGroup.value;

  if(!nameGroup) { this.emit(':tell', "Sorry, I didn't hear a subway line or group I recognized") };

  fetchMTAStatus(statuses => {
    let closestLine = closestLineMatcher(statuses, 'nameGroup', heardNameGroup);

    this.emit('tell', `Your favorite line is ${closestLine.nameGroup}`);
  });
}
