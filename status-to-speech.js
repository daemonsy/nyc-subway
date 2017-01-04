module.exports = function(line, status) {
  var normalizedStatus = status.toLowerCase();
  var lineAsDigit = `<say-as interpret-as="digits">${line}</say-as>`;
  var speech = null;
  switch (normalizedStatus) {
    case 'good service':
      speech = 'Good service on the ' + lineAsDigit + ' line';
      break;
    case 'delays':
      speech = 'The ' + lineAsDigit + ' line is experiencing delays';
      break;
    case 'planned work':
      speech = 'The ' + lineAsDigit + ' line is undergoing planned work';
      break;
    case 'service change':
      speech = 'There is a service change on the ' + lineAsDigit + ' line currently';
      break;
    default:
      speech = 'The status of the ' + lineAsDigit + ' line is ' + normalizedStatus;
  };
  return speech;
}
