const http = require("http");
const saveMessage = require("../clients/saveMessage");
const enqueuePayment = require("../queues/enqueuePayment");
const debug = require("debug")("debug:controller/sendMessage");

module.exports = function(params, done) {
  const body = JSON.stringify({ destination: params.destination, body: params.body });
  debug("params", params);
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
      enqueuePayment({ messageId: params.messageId, location: params.location });
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
    enqueuePayment({ messageId: params.messageId, location: params.location });
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
};
