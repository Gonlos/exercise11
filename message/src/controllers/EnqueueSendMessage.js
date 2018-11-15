const http = require("http");
const enqueueMessage = require("../queues/enqueueMessage");
const debug = require("debug")("debug:enqueueSendMessage");
module.exports = function(req, res) {
  debug(req.body);
  enqueueMessage(req.body)
    .then(responseUrlMessage(res))
    .catch(responseError(res));
};

const responseUrlMessage = res => message => {
  debug("respondo mensaje");
  res.send(message);
};
const responseError = res => err => {
  debug("respondo error", err.message);
  res.status(500).send(err.message);
};
