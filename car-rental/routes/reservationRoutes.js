const express = require("express");
const mongoose = require("mongoose");
const Reservation = require("../models/Reservation");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    const { carId, startDate, endDate } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.status(400).json({ message: "Neteisingas automobilio ID." });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);

        const overlappingReservations = await Reservation.find({
            carId: carId,
            status: { $in: ["Patvirtinta", "Laukiama"] },
            $or: [
                { startDate: { $lte: end }, endDate: { $gte: start } },
            ],
        });

        if (overlappingReservations.length > 0) {
            return res.status(400).json({ message: "Pasirinktos datos jau užimtos!" });
        }

        
        const reservation = new Reservation({
            carId,
            userId: req.user.id,
            startDate: start,
            endDate: end,
            status: "Laukiama",
        });

        await reservation.save();
        res.status(201).json({ message: "Rezervacija sėkminga!", reservation });
    } catch (err) {
        console.error("Klaida kuriant rezervaciją:", err);
        res.status(500).json({ message: "Nepavyko sukurti rezervacijos." });
    }
});



router.get("/booked-dates/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Neteisingas automobilio ID." });
        }

        const reservations = await Reservation.find({
            carId: id,
            status: { $in: ["Patvirtinta", "Laukiama"] },
        });

        let bookedDates = reservations.flatMap((reservation) => {
            const dates = [];
            let currentDate = new Date(reservation.startDate);
            while (currentDate <= reservation.endDate) {
                dates.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        });

        res.json([...new Set(bookedDates)]); 
    } catch (err) {
        console.error("Klaida gaunant užimtas datas:", err);
        res.status(500).json({ message: "Klaida gaunant užimtas datas" });
    }
});


router.get("/pending-reservations", authMiddleware, async (req, res) => {
  try {
      const reservations = await Reservation.find({ status: "Laukiama" })
          .populate("userId", "email")
          .populate("carId", "brand model");

      res.status(200).json(reservations);
  } catch (err) {
      console.error("Klaida gaunant laukiančias rezervacijas:", err);
      res.status(500).json({ message: "Nepavyko gauti rezervacijų." });
  }
});


router.get("/approved-reservations", authMiddleware, async (req, res) => {
  try {
      const reservations = await Reservation.find({ status: "Patvirtinta" })
          .populate("userId", "email")
          .populate("carId", "brand model");

      res.status(200).json(reservations);
  } catch (err) {
      console.error("Klaida gaunant patvirtintas rezervacijas:", err);
      res.status(500).json({ message: "Nepavyko gauti rezervacijų." });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
      const { id } = req.params;
      const { startDate, endDate, carId } = req.body;

      console.log("Gauta rezervacijos atnaujinimo užklausa:", { id, startDate, endDate, carId });

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(carId)) {
          return res.status(400).json({ message: "Neteisingi ID." });
      }

      const reservation = await Reservation.findById(id);

      if (!reservation) {
          return res.status(404).json({ message: "Rezervacija nerasta." });
      }

      if (reservation.status === "Patvirtinta") {
          return res.status(400).json({ message: "Negalite keisti patvirtintos rezervacijos." });
      }

      const overlappingReservation = await Reservation.findOne({
          carId,
          _id: { $ne: id },
          status: { $in: ["Patvirtinta", "Laukiama"] },
          $or: [
              { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
          ],
      });

      if (overlappingReservation) {
          return res.status(400).json({ message: "Pasirinktos datos jau užimtos!" });
      }

     
      reservation.startDate = new Date(startDate);
      reservation.endDate = new Date(endDate);
      reservation.status = "Laukiama";
      await reservation.save();

      console.log("Rezervacija sėkmingai atnaujinta ir perkelta į 'Laukiama':", reservation);
      res.status(200).json({ message: "Rezervacija atnaujinta sėkmingai.", reservation });
  } catch (err) {
      console.error("Klaida keičiant rezervacijos datą:", err);
      res.status(500).json({ message: "Nepavyko atnaujinti rezervacijos." });
  }
});



router.get("/rejected-reservations", authMiddleware, async (req, res) => {
  try {
      const reservations = await Reservation.find({ status: "Atmesta" })
          .populate("userId", "email")
          .populate("carId", "brand model");

      res.status(200).json(reservations);
  } catch (err) {
      console.error("Klaida gaunant atmestas rezervacijas:", err);
      res.status(500).json({ message: "Nepavyko gauti rezervacijų." });
  }
});

router.get("/all-reservations", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Prieiga tik administratoriams" });
    }

    try {
        const reservations = await Reservation.find()
            .populate("userId", "email")
            .populate("carId", "brand model image pricePerDay");

        res.status(200).json(reservations);
    } catch (err) {
        console.error("Klaida gaunant visas rezervacijas:", err);
        res.status(500).json({ message: "Nepavyko gauti rezervacijų." });
    }
});


router.get("/my-reservations", authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find({ userId: req.user.id })
            .populate("carId", "brand model image pricePerDay");

        if (!reservations.length) {
            return res.status(404).json({ message: "Jūs dar neturite rezervacijų." });
        }

        res.status(200).json(reservations);
    } catch (err) {
        console.error("Klaida gaunant vartotojo rezervacijas:", err);
        res.status(500).json({ message: "Nepavyko gauti rezervacijų." });
    }
});



router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findOneAndDelete({ _id: id, userId: req.user.id, status: { $in: ["Laukiama", "Atmesta"] }  });

        if (!reservation) {
            return res.status(404).json({ message: "Rezervacija nerasta arba jau patvirtinta." });
        }

        res.json({ message: "Rezervacija atšaukta sėkmingai." });
    } catch (err) {
        console.error("Klaida atšaukiant rezervaciją:", err);
        res.status(500).json({ message: "Serverio klaida atšaukiant rezervaciją." });
    }
});



router.patch("/update-reservation/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Tik administratoriai gali atnaujinti rezervacijų būseną." });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
        const validStatuses = ["Laukiama", "Patvirtinta", "Atmesta", "Atšaukta", "Įvykdyta"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Netinkama būsena: ${status}. Leidžiamos: ${validStatuses.join(", ")}` });
        }

        const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true })
            .populate("carId", "brand model")
            .populate("userId", "email");

        if (!reservation) {
            return res.status(404).json({ message: "Rezervacija nerasta." });
        }

        res.status(200).json({ message: `Rezervacija atnaujinta į: ${status}`, reservation });
    } catch (err) {
        console.error("Klaida atnaujinant rezervaciją:", err);
        res.status(500).json({ message: "Serverio klaida atnaujinant rezervaciją." });
    }
});

router.delete("/admin/:id", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Prieiga tik administratoriams" });
    }
    try {
      const { id } = req.params;
      const reservation = await Reservation.findByIdAndDelete(id);
      if (!reservation) {
        return res.status(404).json({ message: "Rezervacija nerasta." });
      }
      res.json({ message: "Rezervacija pašalinta sėkmingai." });
    } catch (err) {
      console.error("Klaida šalinant rezervaciją:", err);
      res.status(500).json({ message: "Serverio klaida." });
    }
  });
  

module.exports = router;
