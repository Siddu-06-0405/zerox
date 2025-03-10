import User from "../models/user.model.js";
import generateTokenAndSetcookie from "../utils/generateToken.js";

export const signup = async (req,res)=>{
    try{
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if(password!== confirmPassword){
            return res.status(400).json({error:"Passwords don't match"});
        }

        const user = await User.findOne({username});

        if(user) {
            return res.status(400).json({error: "Username already exists"});
        }

        const newUser = new User({
            fullName, username, 
            password,
            gender
        });


        if(newUser){
            //Generate token here
            generateTokenAndSetcookie(newUser._id,res);// no need for await because it's not an async function

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username:newUser.username,
                profilePic: newUser.profilePic,
            })
        }
    }catch(error){
        console.error("error in signup controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
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