import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/cars.css";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem("token");
      let isAdminUser = false;
      let headers = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        const userRes = await axios.get("http://localhost:5000/api/auth/me", { headers });
        if (userRes.data.role === "admin") {
          setIsAdmin(true);
          isAdminUser = true;
        }
      }

      const url = isAdminUser
        ? "http://localhost:5000/api/cars" 
        : "http://localhost:5000/api/cars/public"; 

      const res = await axios.get(url, { headers });
      setCars(res.data);
      setFilteredCars(res.data);
    } catch (err) {
      console.error("Klaida gaunant automobilius:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const applyFilters = () => {
    let filtered = cars;
    if (priceFilter) {
      filtered = filtered.filter((car) => car.pricePerDay <= priceFilter);
    }
    if (fuelTypeFilter) {
      filtered = filtered.filter((car) => car.fuelType === fuelTypeFilter);
    }
    if (transmissionFilter) {
      filtered = filtered.filter((car) => car.transmission === transmissionFilter);
    }
    setFilteredCars(filtered);
  };

  return (
    <div className="cars-page-container">
      <h2>Automobilių sąrašas</h2>

      <div className="cars-filters">
        <input
          type="number"
          placeholder="Max kaina per dieną"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
        <select value={fuelTypeFilter} onChange={(e) => setFuelTypeFilter(e.target.value)}>
          <option value="">Kuro tipas</option>
          <option value="Benzinas">Benzinas</option>
          <option value="Dyzelinas">Dyzelinas</option>
          <option value="Elektra">Elektra</option>
        </select>
        <select value={transmissionFilter} onChange={(e) => setTransmissionFilter(e.target.value)}>
          <option value="">Pavarų dėžė</option>
          <option value="Automatinė">Automatinė</option>
          <option value="Mechaninė">Mechaninė</option>
        </select>
        <button onClick={applyFilters}>Filtruoti</button>
      </div>

      <div className="cars-list-container">
        {filteredCars.map((car) => (
          <div className="car-card" key={car._id}>
            <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-card-image" />
            <h3>
              {car.brand} {car.model}
            </h3>
            <p>
              Kaina per dieną: <strong>{car.pricePerDay}€</strong>
            </p>
            <Link to={`/cars/${car._id}`} className="car-card-btn">
              Peržiūrėti
            </Link>

            {isAdmin && (
              <Link to={`/admin/cars/edit/${car._id}`} className="car-card-btn car-card-btn-edit">
                Redaguoti
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cars;
