const debug = require("debug")("debug:queues");
const kue = require("kue");
const queue = kue.createQueue({
  redis: {
    host: process.env.REDIS || "localhost"
  }
});

//get number enqueued messages. default messages
queue.getInactiveJobsCount = (type = "message") => {
  return new Promise((resolve, reject) => {
    queue.inactiveCount(type, function(a, b) {
      debug("getInactiveJobsCount", type, a, b);
      if (a) return reject(a);
      resolve(b);
    });
  });
};

queue.getDelayedJobsCount = (type = "message") => {
  return new Promise((resolve, reject) => {
    queue.delayedCount(type, function(a, b) {
      debug("getDelayedJobsCount", type, a, b);
      if (a) return reject(a);
      resolve(b);
    });
  });
};

queue.getActiveJobsCount = (type = "message") => {
  return new Promise((resolve, reject) => {
    queue.activeCount(type, function(a, b) {
      debug("getActiveJobsCount", type, a, b);
      if (a) return reject(a);
      resolve(b);
    });
  });
};

queue.getJobsCount = function(type = "message") {
  return new Promise((resolve, reject) => {
    Promise.all([
      queue.getInactiveJobsCount(type),
      queue.getDelayedJobsCount(type),
      queue.getActiveJobsCount(type)
    ]).then(counts => {
      resolve(counts.reduce((t, a) => t + a));
      debug("promise.all", type, counts);
    });
  });
};

queue.on("error", function(err) {

});

module.exports = queue;
