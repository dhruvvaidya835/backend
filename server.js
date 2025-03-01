const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserSchema = require('./models/User');
const errorHandler = require('./middlewares/errorHandler'); // Use default import

const { protect } = require('./middlewares/authMiddleware');
const generateToken=require('./utils/generateToken');

const app = express();
const PORT = 3000;

app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send("Welcome to Flash Food Delivery Service");
});

// User Registration Route
app.post('/register', async (req, res) => {
    const { fullname, email, password, confirmpassword } = req.body;

    if (!fullname || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    try {
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserSchema({
            fullname,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User Registered Successfully!" });
        console.log("User registration complete...");
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// MongoDB Connection
mongoose.connect("mongodb+srv://Test1234:Test1234@cluster0.wjoqc.mongodb.net/backend?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connected successfully");
}).catch((err) => {
    console.error("DB Connection Error:", err);
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is Running on port: ${PORT}`);
});
