import User from "../models/user.model.js";
import generateTokenAndSetcookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, phoneNumber, password, confirmPassword, gender } = req.body;

        // Check if all fields are provided
        if (!fullName || !username || !email || !phoneNumber || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate phone number (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ error: "Phone number must be exactly 10 digits" });
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        // Create new user
        const newUser = new User({
            fullName,
            username,
            email,
            phoneNumber,
            password,
            gender
        });

        if (newUser) {
            // Generate token and set cookie
            const token = generateTokenAndSetcookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                token
            });
        }
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || password !== user.password) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // ✅ Generate a token
        const token = generateTokenAndSetcookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            token, // ✅ Return token for frontend storage
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully"});

    } catch (error) {
        console.error("error in logout controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const changePassword = async (req, res) => {
    try {
        
        const { userId, oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user || user.password !== oldPassword) {
            return res.status(400).json({ error: "Invalid current password" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error in changePassword controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const changeEmail = async (req, res) => {
    try {
        const { userId, newEmail } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.email = newEmail;
        await user.save();

        res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        console.error("Error in changeEmail controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};