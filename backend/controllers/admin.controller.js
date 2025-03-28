import Admin from "../models/admin.model.js";
import generateTokenAndSetcookieAdmin from "../utils/generateAdminToken.js";
import fs from "fs"

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Admin.findOne({ username });

        if (!user || password !== user.password) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // ✅ Generate a token
        const token = generateTokenAndSetcookieAdmin(user._id, res);

        res.status(200).json({
            _id: user._id,
            AcceptingOrders: user.AcceptingOrders,
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
        console.error("error in logout controller of admin",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
//change the r.txt
export const start = async(req,res)=>{
    try {
        await fs.writeFileSync('files/r.txt', "true");
        res.status(201).json({message:"successfully started services"});
      } catch (err) {
        console.error('Error saving text to file:', err);
        return res.status(500).json({ error: 'Failed to start services' });
      }
}

//change the r.txt
export const stop = async(req,res)=>{
    try {
        await fs.writeFileSync('files/r.txt', "false");
        res.status(201).json({message:"successfully stopped services"});
      } catch (err) {
        console.error('Error saving text to file:', err);
        return res.status(500).json({ error: 'Failed to stop services' });
      }
}