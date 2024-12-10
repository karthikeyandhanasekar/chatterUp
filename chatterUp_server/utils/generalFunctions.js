const fs = require("fs");
//Function to check if object is empty or not
exports.isObjectEmpty = (objectName) => {
  return (
    Object.keys(objectName).length === 0 && objectName.constructor === Object
  );
};

// Reusable function to parse CSV
exports.parseCSV = (filePath, removeAfterParsing = false) => {
  const fs = require("fs");
  const csvParser = require("csv-parser");
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        const cleanedRow = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key.trim().replace(/[^\w\s]/gi, ""), // Remove unwanted symbols from keys
            value.trim(), // Trim whitespace from values
          ])
        );
        results.push(cleanedRow);
      }) // Collect row data
      .on("end", () => {
        // removeAfterParsing && fs.unlinkSync(filePath); // Delete the file after parsing
        resolve(results); // Resolve with parsed data
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath); // Ensure the file is deleted
        reject(error); // Reject with error
      });
  });
};

exports.jsonToCSV = (jsonData, filePath) => {
  if (!Array.isArray(jsonData) || jsonData.length === 0) {
    console.error("Invalid or empty JSON data.");
    return;
  }

  try {
    const fs = require("fs");
    // Extract headers from the first JSON object
    const headers = Object.keys(jsonData[0]);

    // Create CSV content: Start with headers
    const csvContent = [headers.join(",")];

    // Add each JSON object as a CSV row
    jsonData.forEach((row) => {
      const csvRow = headers.map((header) => {
        const value = row[header] !== undefined ? row[header] : "";
        return `"${String(value).replace(/"/g, '""')}"`; // Escape quotes
      });
      csvContent.push(csvRow.join(","));
    });
    // Write the CSV content to a file
    fs.writeFileSync(filePath, csvContent.join("\n"), "utf8");
  } catch (error) {
    console.error("Error converting JSON to CSV:", error.message);
    throw error;
  }
};

// Function to get the list of folders in a directory
exports.getFoldersName = (dirPath) => {
  return new Promise((resolve, reject) => {
    // Read the contents of the directory
    fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return reject(err); // If there's an error, reject the promise
      }

      // Filter the files to include only directories
      const folders = files
        .filter((file) => file.isDirectory())
        .map((file) => file.name); // Get the folder names

      resolve(folders.reverse());
    });
  });
};

exports.genericMongooseErrorFunction = (error, next) => {
  const { CustomErrorHandler } = require("../middleware/errorsMiddleware");
  if (error.name === "ValidationError") {
    errorMessage =
      "Validation failed: " +
      Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
    // You can throw a custom error or format it to return a structured response
    next(new CustomErrorHandler(400, errorMessage));
  }

  if (error.code === 11000) {
    const duplicateKey = error.message.match(/index: (.*)_1 dup key/);
    if (duplicateKey && duplicateKey[1]) {
      const field = duplicateKey[1]; // Extracted field name (e.g., email, phoneNumber)
      next(
        new CustomErrorHandler(
          400,
          `Duplicate value found for the field: ${field}`
        )
      );
    }
  }

  next(new CustomErrorHandler(500, `Internal Server Error`));
};
