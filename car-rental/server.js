require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Prisijungimas prie MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Prisijungta prie MongoDB"))
  .catch((err) => console.error("Nepavyko prisijungti prie DB", err));

// API testas
app.get("/", (req, res) => {
  res.send("Sveiki atvykę į mašinų nuomos API!");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const carRoutes = require("./routes/carRoutes");
app.use("/api/cars", carRoutes);

const reservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", reservationRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);


// Startuojam serverį
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveris veikia ant ${PORT} prievado`));
