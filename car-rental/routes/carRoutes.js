const express = require("express");
const Car = require("../models/Car");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = { status: "Matomas" };
    if (req.user && req.user.role === "admin") {
      query = {};
    }
    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant automobilius" });
  }
});

router.get("/public", async (req, res) => {
  try {
    const cars = await Car.find({ status: "Matomas" }); 
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Serverio klaida" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Automobilis nerastas" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Klaida gaunant automobilį" });
  }
});



router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Tik administratoriai gali pridėti automobilius" });
  }

  try {
    const newCar = await Car.create(req.body);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: "Klaida pridedant automobilį" });
  }
});




router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Tik administratoriai gali atnaujinti automobilius" });
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: "Klaida atnaujinant automobilį" });
  }
});





router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Tik administratoriai gali ištrinti automobilius" });
  }

  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Automobilis ištrintas" });
  } catch (err) {
    res.status(500).json({ message: "Klaida trinant automobilį" });
  }
});

module.exports = router;
