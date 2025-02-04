import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/cars");
    } catch (err) {
      alert("Prisijungimo klaida");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Prisijungimas</h2>
      <form onSubmit={handleLogin}>
        <input type="email" className="login-input" placeholder="El. paštas" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="login-input" placeholder="Slaptažodis" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="login-button">Prisijungti</button>
      </form>
    </div>
  );
};

export default Login;
