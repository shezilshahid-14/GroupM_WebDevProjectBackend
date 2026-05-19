const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");
const User = require("./models/User");
const Arena = require("./models/Arena");
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
const seedArenas = async () => {
    await Arena.deleteMany({}); 
    
    await Arena.insertMany([
        { name: "Iqbal Town Sports Complex", category: "Football", location: "Iqbal Town", price: 3500, rating: 4.8, img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400", slots: ["04:00 PM", "06:00 PM", "08:00 PM"] },
        { name: "Ferozpur Road Turf", category: "Cricket", location: "Ferozpur Road", price: 4500, rating: 4.6, img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=400", slots: ["05:00 PM", "07:00 PM", "09:00 PM"] },
        { name: "Moon Market Badminton", category: "Badminton", location: "Iqbal Town", price: 1000, rating: 4.5, img: "https://images.unsplash.com/photo-1626225967045-94400516fc56?q=80&w=400", slots: ["05:00 PM", "06:00 PM", "07:00 PM"] },
        { name: "Ferozpur Hoops", category: "Basketball", location: "Ferozpur Road", price: 2000, rating: 4.2, img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400", slots: ["06:00 PM", "08:00 PM"] },
        { name: "Wahdat Road Cricket Ground", category: "Cricket", location: "Wahdat Road", price: 3000, rating: 4.3, img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400", slots: ["03:00 PM", "05:00 PM", "10:00 PM"] },
        { name: "Samanabad Table Tennis Club", category: "Table Tennis", location: "Samanabad", price: 800, rating: 4.7, img: "https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=400", slots: ["02:00 PM", "04:00 PM", "06:00 PM"] },
        { name: "Ichhra Basketball Court", category: "Basketball", location: "Ichhra", price: 1500, rating: 4.1, img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400", slots: ["05:00 PM", "07:00 PM"] },
        { name: "Gulshan-e-Ravi Badminton Hub", category: "Badminton", location: "Gulshan-e-Ravi", price: 1200, rating: 4.6, img: "https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=400", slots: ["04:00 PM", "08:00 PM"] },
        { name: "Shah Jamal Futsal", category: "Football", location: "Shah Jamal", price: 4000, rating: 4.9, img: "https://images.unsplash.com/photo-1518605368461-1ee7c532066d?q=80&w=400", slots: ["07:00 PM", "09:00 PM", "11:00 PM"] },
        { name: "Muslim Town Pitch", category: "Football", location: "Muslim Town", price: 3200, rating: 4.4, img: "https://images.unsplash.com/photo-1551280857-2b9ebf241ac4?q=80&w=400", slots: ["06:00 PM", "08:00 PM"] },
        { name: "Naseerabad Sports Center", category: "Table Tennis", location: "Ferozpur Road", price: 700, rating: 4.5, img: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=400", slots: ["01:00 PM", "03:00 PM", "05:00 PM"] },
        { name: "Kalma Chowk Arena", category: "Cricket", location: "Kalma Chowk", price: 5000, rating: 4.8, img: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=400", slots: ["06:00 PM", "09:00 PM", "12:00 AM"] },
        { name: "Ravi Block Nets", category: "Cricket", location: "Iqbal Town", price: 2000, rating: 4.0, img: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=400", slots: ["04:00 PM", "06:00 PM"] },
        { name: "Gaddafi Outer Courts", category: "Basketball", location: "Ferozpur Road", price: 2500, rating: 4.7, img: "https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=400", slots: ["05:00 PM", "07:00 PM", "09:00 PM"] }
    ]);
    console.log("Database seeded with 14 local arenas.");
};
seedArenas();
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Signup successful! Please login." });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); 
        if (!user) return res.status(400).json({ error: "Invalid credentials" });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, "secretKey123", { expiresIn: "1h" });
        res.json({ message: "Login successful!", name: user.name, token });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});
app.get("/api/arenas", async (req, res) => {
    const arenas = await Arena.find();
    res.json(arenas);
});
app.get("/api/arenas/:id", async (req, res) => {
    const arena = await Arena.findById(req.params.id);
    res.json(arena);
});
app.listen(5000, () => console.log("Backend running on port 5000"));
module.exports = app;