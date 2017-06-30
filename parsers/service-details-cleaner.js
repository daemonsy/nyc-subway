const sanitize = require('sanitize-html');
const MATCHERS = {
  br: /<br\/?>\s*/g
}

module.exports = function(detailsText) {
  let text = detailsText.replace(MATCHERS.br, '\n'); // BRs to newline

  return sanitize(text, {
    allowedTags: []
  });
};
