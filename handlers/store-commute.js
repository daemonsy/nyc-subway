module.exports = function() {
  let { subwayStation, subwayDirection, subwayLine } = this.event.request.intent.slots;

  if(this.event.request.dialogState === 'COMPLETED') {
    this.emit(':tell', 'thank you');
  } else {
    console.log(JSON.stringify(this.event));
    this.emit(':delegate');
  }
}
