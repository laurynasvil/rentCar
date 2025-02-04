const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ["Laukiama", "Patvirtinta", "Atmesta", "Atšaukta", "Įvykdyta"],
        default: "Laukiama"
    }
});

module.exports = mongoose.model("Reservation", ReservationSchema);
