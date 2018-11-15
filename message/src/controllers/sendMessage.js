const http = require("http");
const saveMessage = require("../clients/saveMessage");
const enqueuePayment = require("../queues/enqueuePayment");

const logger = require("../logger")("debug:controller/sendMessage");

module.exports = function(params, done) {
  const body = JSON.stringify({ destination: params.destination, body: params.body });
  logger.debug(`params , ${params}`);
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

  return new Promise((resolve, reject) => {
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
              logger.debug(`messageapp:response:error", ${error.message}`);
            } else {
              logger.debug(`messageapp:response:ok`);
            }
            done();
            resolve("--OK--");
          }
        );
      } else {
        logger.error(`Error while sending message`);
        logger.debug(`responseError`);

        saveMessage(
          {
            ...params,
            status: "ERROR"
          },
          () => {
            logger.error(`Internal server error: SERVICE ERROR`);
            done();
            reject("--ERROR--");
          }
        );
      }
    });

    postReq.setTimeout(1000);

    postReq.on("timeout", () => {
      logger.error(`Timeout Exceeded!`);
      postReq.abort();
      enqueuePayment({ messageId: params.messageId, location: params.location });
      saveMessage(
        {
          ...params,
          status: "TIMEOUT"
        },
        () => {
          done();
          reject("--TIMEOUT--");
        }
      );
    });

    postReq.on("error", error => {
      logger.error(error);
      done();
      reject(error);
    });

    postReq.write(body);
    postReq.end();
  });
};
