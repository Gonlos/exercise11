const queue = require("./");
const debug = require("debug")("debug:enqueuePayment");

const enqueuePayment = ({ messageId, location }) => {
  return new Promise((resolve, reject) => {
    const jobPayment = queue
      .create("payment", {
        messageId,
        location
      })

      .save(function(err) {
        if (!err) {
          debug("jobPayment:ok", { messageId, location });
          return resolve({
            messageId,
            location
          });
        }
        debug("jobPayment:error", err);
        return reject(err);
      });
  });
};

module.exports = enqueuePayment;
