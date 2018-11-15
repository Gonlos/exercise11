const database = require("../database");
const Message = require("../models/message");
const { cleanClone } = require("../utils");

function saveMessageReplica(replica, retries) {
  const MessageReplica = Message("replica");
  if (retries > 0) {

    console.log("saveMessageReplica", replica);
    return MessageReplica.findOneAndUpdate({ messageId: replica.messageId }, replica, {
      upsert: true,
      new: true
    })
      .then(doc => {
        console.log("Message replicated successfully", doc);
        return doc;
      })
      .catch(err => {
        console.log("Error while saving message replica", err);
        console.log("Retrying...");
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
      console.log("Message saved successfully:", doc);
      return cleanClone(doc);
    })
    .then(clone => {

      saveMessageReplica(clone, 3);
      return clone;
    })
    .catch(err => {
      console.log("Error while saving message", err);
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
