const database = require("../database");
const Message = require("../models/message");
const { cleanClone } = require("../utils");
const logger = require("../logger")("saveMessage:transaction");
function saveMessageReplica(replica, retries) {
  const MessageReplica = Message("replica");
  if (retries > 0) {
    logger.debug("saveMessageReplica", replica);
    return MessageReplica.findOneAndUpdate({ messageId: replica.messageId }, replica, {
      upsert: true,
      new: true
    })
      .then(doc => {
        logger.info("Message replicated successfully", doc);
        return doc;
      })
      .catch(err => {
        logger.error("Error while saving message replica", err);
        logger.infi("Retrying...");
        return saveMessageReplica(replica, retries - 1);
      });
  }
}

function saveMessageTransaction(newValue) {
  const MessagePrimary = Message();

  let message = cleanClone(newValue);
  return MessagePrimary.findOneAndUpdate({ messageId: message.messageId }, message, {
    upsert: true,
    new: true
  })
    .then(doc => {
      logger.info("Message saved successfully:", doc);
      return cleanClone(doc);
    })
    .then(clone => {
      saveMessageReplica(clone, 3);
      return clone;
    })
    .catch(err => {
      logger.error("Error while saving message", err);
      throw err;
    });
}

module.exports = function(messageParams, cb) {
  const cleanMessageParams = cleanClone(messageParams);
  saveMessageTransaction(cleanMessageParams)
    .then(result => cb(result))
    .catch(err => {
      cb(undefined, err);
    });
};
