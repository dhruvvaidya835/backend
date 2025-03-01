const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register User
const registerUser = async (req, res) => {
    const { fullname, email, password, confirmpassword } = req.body;

    if (!fullname || !email || !password || !confirmpassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User Registered Successfully!" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { registerUser };
