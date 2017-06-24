var pluralize = require('pluralize');

module.exports = function(lines, status) {
  var normalizedStatus = status.toLowerCase();
  var lines = [].concat(lines);
  lines = lines.map(lineGroupName => lineGroupName.split('').join("-"));
  var linesAsDigit = `${lines.join(', ')} ${pluralize('line', lines.length)}`;

  switch (normalizedStatus) {
    case 'good service':
      return `Good service on the ${linesAsDigit}. `;
    case 'delays':
      return `The ${linesAsDigit} ${pluralize('is', lines.length)} experiencing delays. `;
    case 'planned work':
      return `The ${linesAsDigit} ${pluralize('is', lines.length)} undergoing planned work. `;
    case 'service change':
      return `The ${linesAsDigit} ${pluralize('is', lines.length)} undergoing service change. `;
    default:
      return `The status of the ${linesAsDigit} ${pluralize('is', lines.length)} ${normalizedStatus}. `;
  };
}
