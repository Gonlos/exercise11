const http = require("http");
const saveMessage = require("../clients/saveMessage");
const getCredit = require("../clients/getCredit");
const debug = require("debug")("debug:controller/sendMessage");

module.exports = function(params, done) {
  const body = JSON.stringify(params);

  var query = getCredit();

  query.exec(function(err, credit) {
    if (err) return console.log(err);

    current_credit = credit[0].amount;

    if (current_credit > 0) {
      const postOptions = {
        host: `${process.env.MESSAGEAPP || "localhost"}`,


        port: 3000,
        path: "/message",
        method: "post",
        json: true,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        }
      };

      let postReq = http.request(postOptions);

      postReq.on("response", postRes => {
        if (postRes.statusCode === 200) {
          saveMessage(
            {
              ...params,
              status: "OK"
            },
            function(_result, error) {
              if (error) {
                debug("messageapp:response:error", error.message);
              } else {
                debug("messageapp:response:ok");
              }
              done();
            }
          );
        } else {
          console.error("Error while sending message");
          console.log("responseError");

          saveMessage(
            {
              ...params,
              status: "ERROR"
            },
            () => {
              debug("Internal server error: SERVICE ERROR");
              done();
            }
          );
        }
      });

      postReq.setTimeout(3000);

      postReq.on("timeout", () => {
        console.error("Timeout Exceeded!");
        postReq.abort();

        saveMessage(
          {
            ...params,
            status: "TIMEOUT"
          },
          () => {
            debug("Internal server error: TIMEOUT");
            done();
          }
        );
      });

      postReq.on("error", () => {});

      postReq.write(body);
      postReq.end();
    } else {
      saveMessage(
        {
          ...params,
          status: "NO_CREDIT"
        },
        () => {
          debug("No credit error");
          done(new Error("No credit error"));
        }
      );
    }
  });
};
