var sanitize = require('sanitize-html');
var MATCHERS = {
  br: /<br\/?>/g
}

module.exports = function(detailsText) {
  var text = detailsText.replace(MATCHERS.br, '\n');

  return sanitize(text, {
    allowedTags: []
  });
};
