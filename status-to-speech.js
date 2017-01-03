module.exports = function(line, status) {
  var normalizedStatus = status.toLowerCase();
  let speech = null;
  switch (normalizedStatus) {
    case 'good service':
      speech = 'Good service on the ' + line + ' line, yay!';
      break;
    case 'delays':
      speech = 'Oh no, the ' + line + ' line is experiencing delays';
      break;
    case 'planned work':
      speech = 'The ' + line + ' line is undergoing planned work, allow extra time traveling';
      break;
    case 'service change':
      speech = 'There is a service change on the ' + line + ' line currently';
      break;
    default:
      speech = 'The status of the ' + line + ' line is ' + normalizedStatus;
  };
  return speech;
}
