const queue = require("./");
const sendMessage = require("../controllers/sendMessage");

const logger = require("../logger")("debug:dispatcherMessage");
const circuitBreaker = require("../brakes")(sendMessage);

let actualCtx;
resumeProcess();

queue.process("message", (job, ctx, done) => {
  actualCtx = ctx;
  queue
    .getJobsCount("message")
    .then(n => logger.debug(`messages jobs", ${n}`))
    .catch(e => logger.error(`messages job error", ${e}`));

  logger.verbose(`process:message", ${job.data}`);
  circuitBreaker
    .exec(job.data, done)
    .then(ok => logger.debug(`exec:ok", ${ok}`))
    .catch(error => logger.error(`exec:error", ${error.message}`));
});

circuitBreaker.on("circuitOpen", () => {
  actualCtx.pause();
  logger.warn(`Stop queue`);
});

circuitBreaker.on("circuitClosed", () => {
  actualCtx.resume();
  resumeProcess();
});

function resumeProcess() {
  queue.active(function(err, ids) {
    logger.silly(`------------------`);
    ids.forEach(function(id) {
      queue.kue.Job.get(id, function(err, job) {
        job.inactive();
      });
    });
    logger.warn(`Resume queue`);
  });
}
