const queue = require("./");
const debug = require("debug")("debug:dispatcherUpdateCredit");

// queue.process("updateCredit", (job, done) => {
//   debug("worker", job.data);
// debug("clase?", futureCredit);
//   futureCredit.updateCredit(job.data.credit, done);
// });

module.exports = cb => {
  queue.process("updateCredit", (job, done) => {
    debug("worker", job.data);
    cb(job.data.credit, done);
  });
};
