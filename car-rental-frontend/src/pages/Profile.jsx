import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Turite prisijungti norėdami matyti savo profilį.");
      return;
    }

    axios.get("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch((err) => console.error("Klaida gaunant profilį:", err));
  }, []);

  const handleUpdateProfile = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const token = localStorage.getItem("token");

    axios.patch("http://localhost:5000/api/auth/profile", 
      { name, email }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      setSuccessMessage("Profilis sėkmingai atnaujintas!");
      setUser(res.data.user);
      setEditMode(false);
    })
    .catch((err) => {
      setErrorMessage(err.response?.data?.message || "Nepavyko atnaujinti profilio.");
    });
  };

  const handleChangePassword = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const token = localStorage.getItem("token");

    if (!currentPassword || !newPassword) {
      setErrorMessage("Prašome užpildyti visus laukus.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Slaptažodis turi būti bent 6 simbolių ilgio.");
      return;
    }

    axios.patch("http://localhost:5000/api/auth/change-password", 
      { currentPassword, newPassword }, 
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      setSuccessMessage(res.data.message);
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
    })
    .catch((err) => {
      setErrorMessage(err.response?.data?.message || "Nepavyko pakeisti slaptažodžio.");
    });
  };

  if (!user) return <p>Kraunama...</p>;

  return (
    <div className="profile-container">
      <h2>Vartotojo profilis</h2>

      {editMode ? (
        <div className="profile-form">
          <label>Vardas:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          
          <label>El. paštas:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button className="save-btn" onClick={handleUpdateProfile}>Išsaugoti</button>
          <button className="cancel-btn" onClick={() => setEditMode(false)}>Atšaukti</button>
        </div>
      ) : (
        <div className="profile-info">
          <p><strong>Vardas:</strong> {user.name}</p>
          <p><strong>El. paštas:</strong> {user.email}</p>
          <p><strong>Rolė:</strong> {user.role}</p>
          <button className="edit-btn" onClick={() => setEditMode(true)}>Redaguoti profilį</button>
          <button className="password-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
            Keisti slaptažodį
          </button>
        </div>
      )}

      {showPasswordForm && (
        <div className="password-form">
          <label>Dabartinis slaptažodis:</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

          <label>Naujas slaptažodis:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button className="save-btn" onClick={handleChangePassword}>Išsaugoti slaptažodį</button>
          <button className="cancel-btn" onClick={() => setShowPasswordForm(false)}>Atšaukti</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
