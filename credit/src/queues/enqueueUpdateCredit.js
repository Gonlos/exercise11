const uuidv1 = require("uuid/v1");
const queue = require("./");
const getCredit = require("../clients/getCredit");
const debug = require("debug")("debug:enqueueMessage");

const enqueueMessage = parameters => {
  let { messageId, credit } = parameters;
  return new Promise((resolve, reject) => {
    queue.getJobsCount("payment").then(jobsCount => {
      credit = credit - (jobsCount - 1);
    });
    const jobUpdateCredit = queue
      .create("updateCredit", {
        messageId,
        credit
      })

      .save(function(err) {
        if (!err) {
          console.log("save JOB");
          return resolve({
            messageId,
            credit
          });
        }
        return reject(err);
      });
  });
};

module.exports = enqueueMessage;
