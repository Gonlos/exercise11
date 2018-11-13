const enqueuePayment = require("../queues/enqueuePayment");
const queue = require("../queues");
const dispatcherUpdateCredit = require("../queues/dispatcherUpdateCredit");
const debug = require("debug")("debug:futureCredit");
class futureCredit {
  constructor() {
    this.credit = 1;
    this.updateCreditWorker();
    this.initCredit();
  }

  initCredit() {
    enqueuePayment({ messageId: 0, location: { cost: 0, name: "Default" } }).then(job => {
      debug("initCredit", job);
    });
  }

  updateCreditWorker() {
    dispatcherUpdateCredit(this.updateCredit.bind(this));
  }

  updateCredit(credit, done) {
    queue.getJobsCount("message").then(jobsCount => {
      this.credit = credit - jobsCount;
      debug("updateCredit:new", `${credit} - ${jobsCount} = ${this.credit}`);
      done();
    });
  }

  getCredit() {
    debug("getCredit", this.credit);
    return new Promise((resolve, reject) => {
      resolve(this.credit);
    });
  }

  addCredit(amount) {
    debug("addCredit", amount);
    this.credit += amount;
    debug("actual credit", this.credit);
  }
}

module.exports = new futureCredit();
