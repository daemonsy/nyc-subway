const _ = require('lodash');
const levenshtein = require('fast-levenshtein');

module.exports = function(statuses, key, potentialValue) {
  let closetStatus;

  if(potentialValue.length > 1) {
    closestStatus = _.minBy(statuses, function(status) {
      return levenshtein.get(status[key], potentialValue.toUpperCase());
    });
  } else {
    closestStatus = _.find(statuses, function(status) {
      return status[key].search(potentialValue.toUpperCase()) !== -1;
    });
  }
  return closestStatus;
}
