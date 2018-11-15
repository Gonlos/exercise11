const os = require("os");

const logger = require("../logger")("debug:hostname");

module.exports = (req, res) => {
  logger.silly(`This is ${os.hostname()}`);
  res.send(`This is ${os.hostname()}`);
};
