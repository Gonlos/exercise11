const uuidv1 = require("uuid/v1");
const queue = require("./");
const saveMessage = require("../clients/saveMessage");
const debug = require("debug")("debug:enqueueMessage");
const futureCredit = require("../clients/futureCredit");

const enqueueMessage = parameters => {
  return new Promise((resolve, reject) => {
    futureCredit
      .getCredit()
      .then(credit => {
        debug("credit?", parameters);
        if (credit > 0) {
          let messageId = uuidv1();
          saveMessage(
            {
              ...parameters,
              messageId,
              status: "NO_CREDIT"
            },
            function(_result, error) {
              if (error) {
                debug("messageapp:response:error", error.message);
                return reject(error);
              } else {
                debug("messageapp:response:ok", _result);
                if (credit >= _result.location.cost) {
                  futureCredit.addCredit(-_result.location.cost);
                  const jobSendMessage = queue
                    .create("message", {
                      ..._result,
                      messageId,
                      status: "PENDING"
                    })
                    .delay(10000)
                    .save(function(err) {
                      if (!err) {
                        debug("save JOB");
                        saveMessage(
                          {
                            ...parameters,
                            messageId,
                            status: "PENDING"
                          },
                          (_res, err) => {
                            if (err) {
                              return reject(err);
                            }
                          }
                        );
                        return resolve(messageId);
                      }
                      return reject(err);
                    });
                } else {
                  futureCredit.initCredit();
                  return reject({ message: "No Credit" });
                }
              }
            }
          );
        } else {
          return reject({ message: "No Credit" });
        }
      })
      .catch(() => reject({ message: "No Credit" }));
  });
};

module.exports = enqueueMessage;
