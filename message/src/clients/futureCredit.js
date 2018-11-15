const enqueuePayment = require("../queues/enqueuePayment");
const queue = require("../queues");
const dispatcherUpdateCredit = require("../queues/dispatcherUpdateCredit");

const logger = require("../logger")("debug:futureCredit");
class futureCredit {
  constructor() {
    this.credit = 1;
    this.updateCreditWorker();
    this.initCredit();
  }

  initCredit() {
    enqueuePayment({ messageId: 0, location: { cost: 0, name: "Default" } }).then(job => {
      logger.debug(`initCredit, ${job}`);
    });
  }

  updateCreditWorker() {
    dispatcherUpdateCredit(this.updateCredit.bind(this));
  }

  updateCredit(credit, done) {
    queue.getJobsCount("message").then(jobsCount => {
      this.credit = credit - jobsCount;
      logger.debug(`updateCredit:new, ${credit} - ${jobsCount} = ${this.credit}`);
      done();
    });
  }

  getCredit() {
    logger.debug(`getCredit ${this.credit}`);
    return new Promise((resolve, reject) => {
      resolve(this.credit);
    });
  }

  addCredit(amount) {
    logger.debug(`addCredit", ${amount}`);
    this.credit += amount;
    logger.info(`actual credit", ${this.credit}`);
  }
}

module.exports = new futureCredit();
