const { createLogger, format, transports } = require("winston");
const path = require("path");
const { formattedDate } = require("../utils/dateFunction");

class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const todayDate = formattedDate(new Date());
// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, "../", "logs", todayDate);
const logger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, "errors.log"),
      level: "error",
    }),
  ],
});

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || "Internal Server Error";

  const currentTime = new Date().toISOString();
  const url = req.originalUrl;
  // Log error details
  logger.error({
    statusCode,
    message: errorMessage,
    method: req.method,
    url,
    body: req.body,
    timestamp: currentTime,
    stack: err.stack,
  });

  // Respond to the client
  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
  });
};

module.exports = { CustomErrorHandler, errorHandler };
