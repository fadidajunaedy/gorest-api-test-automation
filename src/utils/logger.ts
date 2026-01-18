import winston from "winston";

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }),
);

const logger = winston.createLogger({
  level: "debug",

  transports: [
    new winston.transports.File({
      filename: "logs/execution.log",
      format: fileFormat,
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
    }),
  ],
});

export default logger;
