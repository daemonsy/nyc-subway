const literalize = require('../speech-helpers/literalize.js');
const pluralize = require('pluralize');

module.exports = function() {
  let watchedTrains = (this.attributes["trackedTrainLines"] || []).map(literalize);

  this.emit(":tell", `You're watching the ${watchedTrains.join(", ")} ${pluralize('train', watchedTrains.length)}. `);
}
