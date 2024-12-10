const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const winston = require("winston");
const { formattedDate } = require("../utils/dateFunction");

const todayDate = formattedDate(new Date());
// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, "../", "logs", todayDate);
// Create the directory recursively
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Set up Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, "requests.log"),
    }),
  ],
});

// Middleware for logging and extracting JWT information
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Extract user information from JWT token
  let userName = "Unknown User";
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, "your_secret_key"); // Replace 'your_secret_key' with your actual JWT secret
      userName = decoded.name || decoded.username || "Unknown User";
    } catch (err) {
      logger.error(`JWT decoding error: ${err.message}`);
    }
  }

  // Use Morgan for logging
  const logStream = fs.createWriteStream(
    path.join(logDirectory, "access.log"),
    { flags: "a" }
  );
  morgan.token("user", () => userName);
  morgan.token("body", (req) => JSON.stringify(req.body));
  morgan.token("time-taken", () => `${Date.now() - startTime}ms`);

  const morganMiddleware = morgan(
    ":method :url :status :res[content-length] - :response-time ms | User: :user | Body: :body | Time Taken: :time-taken",
    { stream: logStream }
  );

  // Call Morgan and proceed
  morganMiddleware(req, res, () => {
    // Log request to Winston after the response finishes
    res.on("finish", () => {
      const logDetails = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        user: userName,
        body: req.body,
        timeTaken: `${Date.now() - startTime}ms`,
      };
      logger.info(logDetails);
    });

    next();
  });
};

module.exports = requestLogger;
