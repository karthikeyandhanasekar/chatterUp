const jwt = require("jsonwebtoken");
const jwtParameters = {
  secretKey: "1234567980",
  duration: "48h",
  algorithm: "HS256", // Specify the algorithm explicitly
};
// Function to create a JWT token
exports.generateToken = (payload) => {
  try {
    const options = {
      expiresIn: jwtParameters.duration, // Token expiration time (e.g., 1 hour)
      algorithm: jwtParameters.algorithm, // Add algorithm here
    };
    // Generate the token
    return jwt.sign(payload, jwtParameters.secretKey, options);
  } catch (error) {
    throw error;
  }
};

// validate the token
exports.validateToken = (token) => {
  try {
    const options = {
      algorithms: [jwtParameters.algorithm], // Specify allowed algorithms
    };
    return jwt.verify(token, jwtParameters.secretKey, options); // Verify the token
  } catch (err) {
    throw err;
  }
};
