// customize to fit your scenario (and machine speed of client)
var StructScheduler = {
  maxOpsPerFrame: 500,
  create: require('./scheduler')
};

module.exports = StructScheduler;
