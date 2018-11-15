const Brakes = require("brakes");

const op = { threshold: 1, waitThreshold: 6000, circuitDuration: 6000 };

module.exports = fn => {
  return new Brakes(fn, op);
};
