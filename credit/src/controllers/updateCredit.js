const updatecredit = require("../clients/updateCredit");

module.exports = function(req, res) {
  updatecredit(
    {
      $inc: { amount: req.body.amount },
      status: "ok"
    },
    function(_result, error) {
      if (error) {
        res.statusCode = 500;
        res.end(error);
      }
      res.end("ok");
    }
  );
};
