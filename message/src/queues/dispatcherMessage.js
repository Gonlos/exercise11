const queue = require("./");
const sendMessage = require("../controllers/sendMessage");
const debug = require("debug")("debug:dispatcherMessage");
const circuitBreaker = require("../brakes")(sendMessage);

let actualCtx;
resumeProcess();

queue.process("message", (job, ctx, done) => {
  actualCtx = ctx;
  queue
    .getJobsCount("message")
    .then(n => debug("messages jobs", n))
    .catch(e => debug("messages job error", e));

  debug("process:message", job.data);
  circuitBreaker
    .exec(job.data, done)
    .then(ok => debug("exec:ok", ok))
    .catch(error => debug("exec:error", error.message));
});

circuitBreaker.on("circuitOpen", () => {
  actualCtx.pause();
  debug("Stop queue");
});

circuitBreaker.on("circuitClosed", () => {
  actualCtx.resume();
  resumeProcess();
});

function resumeProcess() {
  queue.active(function(err, ids) {
    debug("------------------");
    ids.forEach(function(id) {
      queue.kue.Job.get(id, function(err, job) {
        job.inactive();
      });
    });
    debug("Resume queue");
  });
}
