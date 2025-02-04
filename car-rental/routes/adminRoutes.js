const express = require("express");
const Reservation = require("../models/Reservation");
const Car = require("../models/Car");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats/reservations-per-month", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Prieiga tik administratoriams" });
  }
  try {
    const stats = await Reservation.aggregate([
      {
        $group: {
          _id: { year: { $year: "$startDate" }, month: { $month: "$startDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $let: {
              vars: {
                months: [
                  "", "Sausis", "Vasaris", "Kovas", "Balandis",
                  "Gegužė", "Birželis", "Liepa", "Rugpjūtis",
                  "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"
                ]
              },
              in: { $arrayElemAt: ["$$months", "$_id.month"] }
            }
          },
          count: 1
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    console.error("Klaida gaunant statistiką:", err);
    res.status(500).json({ message: "Klaida gaunant statistiką" });
  }
});



router.get("/stats/popular-cars", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Prieiga tik administratoriams" });
  }

  try {
    const popularCars = await Reservation.aggregate([
      {
        $group: {
          _id: "$carId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "cars",
          localField: "_id",
          foreignField: "_id",
          as: "car",
        },
      },
      { $unwind: "$car" }
    ]);

    if (!popularCars.length) {
      return res.status(404).json({ message: "Nėra pakankamai duomenų apie populiariausius automobilius." });
    }

    res.json(popularCars);
  } catch (err) {
    console.error("Klaida gaunant populiariausius automobilius:", err);
    res.status(500).json({ message: "Klaida gaunant populiariausius automobilius" });
  }
});

module.exports = router;
