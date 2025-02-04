const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("Vartotojo ID iš tokeno:", req.user.id); 
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Vartotojas nerastas" });
    }
    res.json(user);
  } catch (err) {
    console.error("Klaida gaunant vartotojo duomenis:", err);
    res.status(500).json({ message: "Serverio klaida" });
  }
});


router.patch("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Vartotojas nerastas." });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Dabartinis slaptažodis neteisingas." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Slaptažodis turi būti bent 6 simbolių ilgio." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json();
  } catch (err) {
    console.error("Klaida keičiant slaptažodį:", err);
    res.status(500).json({ message: "Serverio klaida keičiant slaptažodį." });
  }
});


router.patch("/profile", authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Vartotojas nerastas." });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({ message: "Profilis sėkmingai atnaujintas.", user });
  } catch (err) {
    console.error("Klaida atnaujinant profilį:", err);
    res.status(500).json({ message: "Serverio klaida atnaujinant profilį." });
  }
});




router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) return res.status(401).json({ message: "Nėra autorizacijos token'o" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Vartotojas nerastas" });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Klaida tikrinant vartotoją:", err);
    res.status(500).json({ message: "Serverio klaida" });
  }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Visi laukai privalomi!" });
      }
        const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Vartotojas nerastas" });
      }
        const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Neteisingas slaptažodis" });
      }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      res.json({ message: "Prisijungimas sėkmingas", token, user });
    } catch (err) {
      console.error("Prisijungimo klaida backend'e:", err);
      res.status(500).json({ message: "Serverio klaida prisijungiant." });
    }
  });
  

  router.get("/booked-dates/:id", async (req, res) => {
    const { id } = req.params;
    console.log("Gauta užklausa gauti užimtas datas automobiliui:", id);
    try {
      if (!id) {
        return res.status(400).json({ message: "Trūksta automobilio ID." });
      }
        const reservations = await Reservation.find({ carId: new mongoose.Types.ObjectId(id) });
  
      if (!reservations || reservations.length === 0) {
        console.log("Rezervacijų nerasta automobiliui:", id);
        return res.status(404).json({ message: "Rezervacijų nerasta šiam automobiliui." });
      }
        const bookedDates = [];
      reservations.forEach((reservation) => {
        let currentDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
          while (currentDate <= endDate) {
          bookedDates.push(currentDate.toISOString().split("T")[0]); 
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      console.log("Sugeneruotos užimtos datos:", bookedDates); 
      res.status(200).json(bookedDates);
    } catch (err) {
      console.error("Klaida gaunant užimtas datas:", err);
      res.status(500).json({ message: "Serverio klaida gaunant užimtas datas." });
    }
  });


router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Visi laukai privalomi!" });
      }
        const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Vartotojas su tokiu el. paštu jau egzistuoja." });
      }
        const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword });
  
      res.status(201).json({ message: "Vartotojas sėkmingai sukurtas!", user: newUser });
    } catch (err) {
      console.error("Registracijos klaida backend'e:", err);
      res.status(500).json({ message: "Serverio klaida registruojant vartotoją." });
    }
  });
  

module.exports = router;
