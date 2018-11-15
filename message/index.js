const http = require("http");
const express = require("express");

const bodyParser = require("body-parser");
const { Validator, ValidationError } = require("express-json-validator-middleware");

const sendMessage = require("./src/controllers/EnqueueSendMessage");
const getMessages = require("./src/controllers/getMessages");
const getMessageStatus = require("./src/controllers/getMessageStatus");
const health = require("./src/controllers/health");
require("./src/queues/dispatcherMessage");
require("./src/clients/futureCredit");

const app = express();

const validator = new Validator({ allErrors: true });
const { validate } = validator;

const messageSchema = {
  type: "object",
  required: ["destination", "body"],
  properties: {
    destination: {
      type: "string"
    },
    body: {
      type: "string"
    },
    location: {
      name: {
        type: "string"
      },
      cost: {
        type: "number"
      }
    }
  }
};

app.get("/version", (req, res) => {
  res.status(200).send(process.env.SERVICE_NAME);
});

app.get("/health", health);

app.post("/messages", bodyParser.json(), validate({ body: messageSchema }), sendMessage);

app.get("/messages", getMessages);

app.get("/message/:messageId/status", getMessageStatus);

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

app.listen(9007, function() {
  console.log("App started on PORT 9007");
});
