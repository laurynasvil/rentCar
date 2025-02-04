import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      console.log("Registracija sėkminga:", response.data);
      alert("Registracija sėkminga! Dabar galite prisijungti.");
      navigate("/Login");
    } catch (err) {
      console.error("Registracijos klaida:", err.response ? err.response.data : err);
      alert("Registracijos klaida: " + (err.response ? err.response.data.message : "Nežinoma klaida"));
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registracija</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="register-input"
          placeholder="Vardas"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="register-input"
          placeholder="El. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="register-input"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="register-button">
          Registruotis
        </button>
      </form>
    </div>
  );
};

export default Register;
