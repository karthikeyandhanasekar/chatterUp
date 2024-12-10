const mongoose = require("mongoose");
const baseUrl = process.env.MONGODB || "0.0.0.0:27017";

exports.connectToDb = async () => {
  try {
    await mongoose.connect(`mongodb://${baseUrl}/chatterUpDB`);
    console.log("MongoDB connected using mongoose");
  } catch (err) {
    console.log(err);
  }
};
