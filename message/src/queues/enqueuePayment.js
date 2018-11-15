const queue = require("./");

const logger = require("../logger")("debug:enqueuePayment");

const enqueuePayment = ({ messageId, location }) => {
  return new Promise((resolve, reject) => {
    const jobPayment = queue
      .create("payment", {
        messageId,
        location
      })

      .save(function(err) {
        if (!err) {
          logger.debug(`jobPayment:ok", ${{ messageId, location }}`);
          return resolve({
            messageId,
            location
          });
        }
        logger.error(`jobPayment:error", ${err}`);
        return reject(err);
      });
  });
};

module.exports = enqueuePayment;
