const _ = require('lodash');

// Speech Helpers
const literalize = require('../speech-helpers/literalize.js');
const statusToSpeech = require('../speech-helpers/status-to-speech.js');

// Services
const fetchMTAStatus = require('../services/fetch-mta-status.js');

// Utilities
const withServiceIssues = require('../utilities/with-service-issues.js');

module.exports = function() {
  let watchedTrains = (this.attributes["trackedTrainLines"] || []);
  fetchMTAStatus(statuses => {

    watchedTrainsWithIssues = _(statuses)
      .filter(withServiceIssues)
      .filter(status => watchedTrains.includes(status.nameGroup))
      .value();

    if(watchedTrainsWithIssues.length > 0) {
      let statusMessages = watchedTrainsWithIssues.map(status => statusToSpeech(status.nameGroup, status.status));
      this.emit(':tell', `There are issues with your commute. ${statusMessages.join(' ')}`);
    } else {
      this.emit(':tell', `Your commute is looking good, <say-as="interjection">bam<say-as>!`)
    }
  });
}
