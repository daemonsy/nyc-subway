var Alexa = require('alexa-sdk');

var handlers = {
  subwayLineOrGroup: function () {
    this.emit(':tell', 'Hello World!');
  },

  Unhandled: function() {
    this.emit(':tell', 'Hello World');
  }
};

exports.handler = function(event, context, callback){
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
