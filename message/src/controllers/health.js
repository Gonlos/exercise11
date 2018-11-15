const os = require("os");
const debug = require("debug")("debug:hostname");

module.exports = (req, res) => {
  debug(`This is ${os.hostname()}`);
  res.send(`This is ${os.hostname()}`);
};
