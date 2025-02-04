import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/editCar.css";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [passengerCapacity, setPassengerCapacity] = useState("");
  
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("Matomas");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
        const carData = res.data;
        setCar(carData);
        setBrand(carData.brand);
        setModel(carData.model);
        setFuelType(carData.fuelType);
        setTransmission(carData.transmission);
        setPricePerDay(carData.pricePerDay);
        setPassengerCapacity(carData.passengerCapacity);
        
        setDescription(carData.description);
        setImage(carData.image);
        setStatus(carData.status);
      } catch (err) {
        console.error("Klaida gaunant automobilio duomenis:", err);
      }
    };

    const checkUserRole = () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      axios
        .get("http://localhost:5000/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setIsAdmin(res.data.role === "admin");
        })
        .catch((err) => console.error("Klaida tikrinant vartotojo rolę:", err));
    };

    fetchCar();
    checkUserRole();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/cars/${id}`,
        {
          brand,
          model,
          fuelType,
          transmission,
          pricePerDay,
          passengerCapacity,
          description,
          image,
          status
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Automobilis sėkmingai atnaujintas!");
      navigate(`/cars/${id}`);
    } catch (err) {
      alert("Klaida atnaujinant automobilį: " + (err.response?.data?.message || "Nežinoma klaida."));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Ar tikrai norite ištrinti šį automobilį?")) return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Automobilis sėkmingai ištrintas!");
      navigate("/cars");
    } catch (err) {
      alert("Klaida trinant automobilį: " + (err.response?.data?.message || "Nežinoma klaida."));
    }
  };

  if (!car) return <p>Kraunama...</p>;

  return (
    <div className="edit-car-container">
      <h2>Redaguoti automobilį</h2>
      <form className="edit-car-form" onSubmit={handleSubmit}>
        <div className="edit-car-form-group">
          <label>Markė</label>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div className="edit-car-form-group">
          <label>Modelis</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="edit-car-form-group">
          <label>Kuro tipas</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} required>
            <option value="">Pasirinkite kuro tipą</option>
            <option value="Benzinas">Benzinas</option>
            <option value="Dyzelinas">Dyzelinas</option>
            <option value="Elektra">Elektra</option>
          </select>
        </div>
        <div className="edit-car-form-group">
          <label>Pavarų dėžė</label>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)} required>
            <option value="">Pasirinkite pavarų dėžę</option>
            <option value="Automatinė">Automatinė</option>
            <option value="Mechaninė">Mechaninė</option>
          </select>
        </div>
        <div className="edit-car-form-group">
          <label>Kaina per dieną (€)</label>
          <input type="number" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} required />
        </div>
        <div className="edit-car-form-group">
          <label>Keleivių skaičius</label>
          <input type="number" value={passengerCapacity} onChange={(e) => setPassengerCapacity(e.target.value)} required />
        </div>
        <div className="edit-car-form-group">
          <label>Automobilio aprašymas</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="edit-car-form-group">
          <label>Nuotraukos URL</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        </div>
        <div className="edit-car-form-group">
    <label>Statusas</label>
    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="Matomas">Matomas</option>
        <option value="Juodraštis">Juodraštis</option>
    </select>
</div>

        <button type="submit" className="edit-car-submit-btn">Atnaujinti automobilį</button>
          <button type="button" className="delete-car-btn" onClick={handleDelete}>
            Ištrinti automobilį
          </button>
      </form>
    </div>
  );
};

export default EditCar;
