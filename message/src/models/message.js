const mongoose = require("mongoose");
const database = require("../database");

let messageSchema = new mongoose.Schema(
  {
    destination: String,
    body: String,
    location: {
      name: {
        type: String,
        default: "Default"
      },
      cost: {
        type: Number,
        default: 1
      }
    },
    messageId: String,
    status: {
      type: String,
      enum: ["ERROR", "OK", "TIMEOUT", "NO_CREDIT", "PENDING"]
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = dbKey => database.get(dbKey).model("Message", messageSchema);
