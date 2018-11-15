const http = require("http");
const enqueueMessage = require("../queues/enqueueMessage");

const logger = require("../logger")("debug:enqueueSendMessage");
module.exports = function(req, res) {
  logger.debug(req.body);
  enqueueMessage(req.body)
    .then(responseUrlMessage(res))
    .catch(responseError(res));
};

const responseUrlMessage = res => message => {
  logger.verbose(`respondo mensaje`);
  res.send(message);
};
const responseError = res => err => {
  logger.verbose(`respondo error", ${err.message}`);
  res.status(500).send(err.message);
};
