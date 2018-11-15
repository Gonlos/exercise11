const http = require("http");
const { enqueueMessage } = require("../messagesQueue");
const getCredit = require("../clients/getCredit");

module.exports = function(req, res) {
  enqueueMessage(req.body)
    .then(responseUrlMessage(res))
    .catch(responseError(res));
};

const responseUrlMessage = res => messageId => {
  console.log("respondo mensaje");
  res.send(`http://localhost:9005/message/${messageId}/status`);
};
const responseError = res => err => {
  console.log("respondo error");
  res.status(500).send(err.message);
};
