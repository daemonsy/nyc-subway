var sanitize = require('sanitize-html');
var MATCHERS = {
  br: /<br\/?>\s*/g
}

module.exports = function(detailsText) {
  var text = detailsText.replace(MATCHERS.br, '\n'); // BRs to linebreaks

  return sanitize(text, {
    allowedTags: []
  });
};
