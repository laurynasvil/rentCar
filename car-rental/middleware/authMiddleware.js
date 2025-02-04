const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("Gautas Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Prieiga uždrausta, nėra tokeno" });
  }

  try {
    const token = authHeader.split(" ")[1]; 
    console.log("Gautas token:", token);

    if (!token) {
      return res.status(401).json({ message: "Neteisingas token formatas" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Vartotojas nerastas" });
    }

    req.user = { id: user._id, role: user.role }; 
    console.log("Autentifikuotas vartotojas:", req.user); 

    next();
  } catch (err) {
    res.status(400).json({ message: "Netinkamas token" });
  }
};

module.exports = authMiddleware;

