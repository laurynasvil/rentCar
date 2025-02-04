import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const fetchUserRole = async () => {
      if (token) {
        try {
          const userRes = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.data.role === "admin") {
            setIsAdmin(true);
          }
        } catch (err) {
          console.error("Klaida tikrinant vartotojo rolę:", err);
        }
      }
    };

    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars/public");
        setCars(res.data);
      } catch (err) {
        console.error("Klaida gaunant automobilių sąrašą:", err);
      }
    };
    

    fetchUserRole();
    fetchCars();
  }, []);

  return (
    <div>
      <div className="home-container">
        <h2 className="home-title">Sveiki atvykę į Mašinų Nuomos Sistemą</h2>
        <p className="home-description">
          Pasirinkite automobilį ir rezervuokite jį dabar! Greitas ir paprastas būdas rasti jums tinkamą transporto priemonę.
        </p>
        <ul className="home-features">
          <li className="home-feature">Platus automobilių pasirinkimas įvairiems poreikiams</li>
          <li className="home-feature">Lankstūs nuomos laikotarpiai</li>
          <li className="home-feature">Patogus užsakymo procesas</li>
          <li className="home-feature">Konkurencingos kainos</li>
          <li className="home-feature">Draugiškas klientų aptarnavimas</li>
        </ul>

        {!isAuthenticated && (
          <div className="home-buttons">
            <Link to="/login" className="home-button home-login-btn">Prisijungti</Link>
            <Link to="/register" className="home-button home-register-btn">Registruotis</Link>
          </div>
        )}
      </div>

      <div>
        <h3 className="home-cars-title">Mūsų Automobiliai</h3>
        <div className="home-cars-container">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div key={car._id} className="home-car-card">
                <img src={car.image} alt={`${car.brand} ${car.model}`} className="home-car-image" />
                <h4>{car.brand} {car.model}</h4>
                <p>Kaina: {car.pricePerDay} €/dienai</p>
                <Link to={`/cars/${car._id}`} className="home-car-button">Žiūrėti</Link>
              </div>
            ))
          ) : (
            <p className="home-no-cars">Šiuo metu nėra jokių automobilių.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
