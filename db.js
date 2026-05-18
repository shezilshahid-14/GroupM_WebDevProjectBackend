const mongoose = require("mongoose");
const connectDB = async (mongoUri) => {
    const uri = mongoUri || process.env.MONGO_URI || "mongodb://localhost:27017/groundverseDB";
    try {
        await mongoose.connect(uri);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed", error);
    }
};
module.exports = connectDB;