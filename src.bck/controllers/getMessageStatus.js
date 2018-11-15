const getMessageStatus = require("../clients/getMessageStatus");

module.exports = function(req, res) {
  getMessageStatus({ messageId: req.params.messageId }).then(messages => {
    res.json(messages);
  });
};
