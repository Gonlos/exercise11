const Credit = require("../models/credit");
const updateCreditTransaction = require("../transactions/updateCredit");

module.exports = function(creditParams, cb) {
  const CreditModel = Credit();
  let credit = new CreditModel(creditParams);
  let conditions = {
    location: credit.location
  };
  return updateCreditTransaction(conditions, creditParams, cb);
};
