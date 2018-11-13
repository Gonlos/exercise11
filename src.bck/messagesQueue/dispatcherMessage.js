const kue = require("kue");
const queue = kue.createQueue();
const sendMessage = require("../controllers/sendMessage");
const debug = require("debug")("debug:dispatcherMessage");

queue.process("message", (job, done) => {
  debug("worker", job.data);
  sendMessage(job.data, done);
});
