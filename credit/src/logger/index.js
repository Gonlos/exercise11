const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, colorize } = format;
const moment = require("moment");
const myFormat = printf(info => {
  return `${moment(info.timestamp).format("YYYY-MM-DD HH:mm:ss")} ${info.level} [${info.label}] : ${
    info.message
  }`;
});
module.exports = myLabel =>
  createLogger({
    level: process.env.LOGGER || "info",
    format: combine(colorize(), label({ label: myLabel }), timestamp(), myFormat),
    transports: [new transports.Console()]
  });
