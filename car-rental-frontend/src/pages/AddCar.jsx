import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/addCar.css";

const AddCar = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [passengerCapacity, setPassengerCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/cars",
        { brand, model, fuelType, transmission, pricePerDay, passengerCapacity, description, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Automobilis pridėtas sėkmingai!");
      navigate("/cars");
    } catch (err) {
      alert("Klaida pridedant automobilį: " + (err.response?.data?.message || "Nežinoma klaida"));
    }
  };

  return (
    <div className="add-car-container">
      <h2 className="add-car-title">Pridėti naują automobilį</h2>
      <form className="add-car-form" onSubmit={handleSubmit}>
        <div className="add-car-group">
          <label className="add-car-label">Markė</label>
          <input type="text" className="add-car-input" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Modelis</label>
          <input type="text" className="add-car-input" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Kuro tipas</label>
          <select className="add-car-select" value={fuelType} onChange={(e) => setFuelType(e.target.value)} required>
            <option value="">Pasirinkite kuro tipą</option>
            <option value="Benzinas">Benzinas</option>
            <option value="Dyzelinas">Dyzelinas</option>
            <option value="Elektra">Elektra</option>
          </select>
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Pavarų dėžė</label>
          <select className="add-car-select" value={transmission} onChange={(e) => setTransmission(e.target.value)} required>
            <option value="">Pasirinkite pavarų dėžę</option>
            <option value="Automatinė">Automatinė</option>
            <option value="Mechaninė">Mechaninė</option>
          </select>
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Kaina per dieną (€)</label>
          <input type="number" className="add-car-input" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required />
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Keleivių skaičius</label>
          <input type="number" className="add-car-input" value={passengerCapacity} onChange={(e) => setPassengerCapacity(e.target.value)} required />
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Automobilio aprašymas</label>
          <textarea className="add-car-textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="add-car-group">
          <label className="add-car-label">Nuotraukos URL</label>
          <input type="text" className="add-car-input" value={image} onChange={(e) => setImage(e.target.value)} required />
        </div>
        <button type="submit" className="add-car-button">Pridėti automobilį</button>
      </form>
    </div>
  );
};

export default AddCar;
