export const protectAdmin = (req, res, next) => {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";
  
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ message: "Unauthorized - No credentials provided" });
    }
  
    // Extract Base64 encoded credentials
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
  
    if (username === adminUsername && password === adminPassword) {
      return next();
    } else {
      return res.status(403).json({ message: "Access denied - Invalid admin credentials" });
    }
  };
  