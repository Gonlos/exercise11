const queue = require("./");
const updateCreditTransaction = require("../transactions/updateCredit");
const enqueueUpdateCredit = require("../queues/enqueueUpdateCredit");
const debug = require("debug")("debug:dispatcherPayment");

queue.process("payment", (job, done) => {
  debug("worker", job.data);
  updateCreditTransaction(
    {
      amount: { $gte: job.data.location.cost },
      location: job.data.location.name
    },
    {
      $inc: { amount: -job.data.location.cost }
    },
    function(_result, error) {
      if (error) {
        debug("updateCredit:error");
      } else {
        enqueueUpdateCredit({ messageId: job.data.messageId, credit: _result.amount }).then(job => {
          debug("enqueueUpdateCredit:ok", job);
          done();
        });
      }
    }
  );
});
