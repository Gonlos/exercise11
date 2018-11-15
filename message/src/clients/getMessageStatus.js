const Message = require("../models/message");
const logger = require("../logger");
module.exports = function(conditions = {}) {
  logger.debug(conditions);
  return Message().findOne(conditions, { status: 1, _id: 0 });
};
