const queue = require("./");

const logger = require("../logger")("debug:dispatcherUpdateCredit");

module.exports = cb => {
  queue.process("updateCredit", (job, done) => {
    logger.silly(`worker", ${job.data}`);
    cb(job.data.credit, done);
  });
};
