const Message = require("../models/message");

module.exports = function(conditions = {}) {
  console.log(conditions);
  return Message().findOne(conditions, { status: 1, _id: 0 });
};
