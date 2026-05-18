const mongoose = require("mongoose");
await mongoose.connect(process.env.MONGO_URI);
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/groundverseDB");
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Database Connection Failed", error);
    }
};
module.exports = connectDB;