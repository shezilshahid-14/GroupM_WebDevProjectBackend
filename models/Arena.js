const mongoose = require("mongoose");

const ArenaSchema = new mongoose.Schema({
    name: String,
    category: String,
    location: String,
    price: Number,
    rating: Number,
    img: String,
    slots: [String]
});

module.exports = mongoose.model("Arena", ArenaSchema);