import jwt from "jsonwebtoken";

const generateTokenAndSetcookieAdmin = (userId, res)=>{
    console.log("JWT_SECRET_ADMIN at Token Generation:", process.env.JWT_SECRET_ADMIN);
    const token = jwt.sign({userId},process.env.JWT_SECRET_ADMIN,{
        expiresIn: '15d'
    });

    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        secure: process.env.NODE_ENV !== "development",
        sameSite:"strict", // CRSF attacks cross-site request forgery attacks
    });
    return token;
};

export default generateTokenAndSetcookieAdmin;