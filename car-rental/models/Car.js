const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
    brand: String,
    model: String,
    pricePerDay: Number,
    fuelType: String,
    transmission: String,
    passengerCapacity: Number,
    luggageCapacity: Number,
    description: String,
    image: String,
    status: {
        type: String,
        enum: ["Matomas", "Juodraštis"],
        default: "Matomas"
    }
});

module.exports = mongoose.model("Car", CarSchema);
