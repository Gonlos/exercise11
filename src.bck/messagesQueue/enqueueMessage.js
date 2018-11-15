const uuidv1 = require("uuid/v1");
const kue = require("kue");
const queue = kue.createQueue();
const getCredit = require("../clients/getCredit");
const saveMessage = require("../clients/saveMessage");
const debug = require("debug")("debug:enqueueMessage");

const enqueueMessage = parameters => {
  return new Promise((resolve, reject) => {
    getCredit().exec((err, credit) => {
      if (err) return reject(err);
      if (credit[0].amount <= 0) return reject({ status: 400, message: "No Credit" });
      let messageId = uuidv1();

      console.log("enque", parameters);

      const jobSendMessage = queue
        .create("message", {
          ...parameters,
          messageId,
          status: "PENDING"
        })
        .delay(10000)
        .save(function(err) {
          if (!err) {
            saveMessage(
              {
                ...parameters,
                messageId,
                status: "PENDING"
              },
              function(_result, error) {
                if (error) {
                  debug("messageapp:response:error", error.message);
                } else {
                  debug("messageapp:response:ok");
                }
              }
            );
            console.log("save JOB");
            return resolve(messageId);
          }
          return reject(err);
        });
    });
  });
};

module.exports = enqueueMessage;
