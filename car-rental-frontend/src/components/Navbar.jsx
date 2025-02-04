import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      const user = JSON.parse(atob(token.split(".")[1])); 
      setUserRole(user.role);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="carsLink"><h2>Mašinų Nuoma</h2></Link>
      
      <button className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/cars">Automobiliai</Link></li>
        
        {token ? (
          <>
            <li><Link to="/my-reservations">Mano rezervacijos</Link></li>
            <li><Link to="/profile">Profilis</Link></li>
            {userRole === "admin" && <li><Link to="/admin">Admin Skydelis</Link></li>}
            <li><button onClick={handleLogout} className="logout-btn">Atsijungti</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Prisijungti</Link></li>
            <li><Link to="/register">Registruotis</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
