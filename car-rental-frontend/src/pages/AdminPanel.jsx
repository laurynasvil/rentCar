import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/adminPanel.css";

const AdminPanel = () => {
  const [reservationsPerMonth, setReservationsPerMonth] = useState([]);
  const [popularCars, setPopularCars] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [approvedReservations, setApprovedReservations] = useState([]);
  const [rejectedReservations, setRejectedReservations] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [reservationsStats, carsStats, pending, approved, rejected] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats/reservations-per-month", { headers }),
          axios.get("http://localhost:5000/api/admin/stats/popular-cars", { headers }),
          axios.get("http://localhost:5000/api/reservations/pending-reservations", { headers }),
          axios.get("http://localhost:5000/api/reservations/approved-reservations", { headers }),
          axios.get("http://localhost:5000/api/reservations/rejected-reservations", { headers }),
        ]);

        setReservationsPerMonth(reservationsStats.data);
        setPopularCars(carsStats.data);
        setPendingReservations(pending.data);
        setApprovedReservations(approved.data);
        setRejectedReservations(rejected.data);
        setLoading(false);
      } catch (err) {
        console.error("Klaida įkeliant duomenis:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteReservation = async (reservationId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Autentifikacijos tokenas nerastas. Prašome prisijungti.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/reservations/admin/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Rezervacija pašalinta sėkmingai.");
      window.location.reload();
    } catch (err) {
      console.error("Nepavyko pašalinti rezervacijos:", err);
      toast.error("Nepavyko pašalinti rezervacijos.");
    }
  };

  const handleUpdate = async (id, status) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/reservations/update-reservation/${id}`,
        { status },
        { headers }
      );

      alert(response.data.message);

      if (status === "Patvirtinta") {
        setApprovedReservations([...approvedReservations, response.data.reservation]);
        setPendingReservations(pendingReservations.filter(reservation => reservation._id !== id));
      } else if (status === "Atmesta") {
        setRejectedReservations([...rejectedReservations, response.data.reservation]);
        setPendingReservations(pendingReservations.filter(reservation => reservation._id !== id));
      }
    } catch (err) {
      alert("Klaida atnaujinant rezervaciją: " + (err.response?.data?.message || "Nežinoma klaida"));
    }
  };

  if (loading) {
    return <p>Kraunama...</p>;
  }

  return (
    <div className="admin-panel-container">
      <h2>Administratoriaus Valdymo Skydelis</h2>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Išnuomoti automobiliai</h3>
          {popularCars.length > 0 ? (
            popularCars.map(car => (
              <p key={car._id}>
                <strong>{car.car.brand} {car.car.model}:</strong> {car.count} rezervacijų
              </p>
            ))
          ) : (
            <p>Nėra duomenų</p>
          )}
        </div>
      </section>

      <Link to="/add-car" className="admin-add-car-btn">Pridėti naują automobilį</Link>

      <div className="tabs">
        <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>Laukiančios</button>
        <button className={activeTab === "approved" ? "active" : ""} onClick={() => setActiveTab("approved")}>Patvirtintos</button>
        <button className={activeTab === "rejected" ? "active" : ""} onClick={() => setActiveTab("rejected")}>Atmestos</button>
      </div>

      {activeTab === "pending" && (
        <ul className="admin-reservation-list">
          {pendingReservations.map(reservation => (
            <li key={reservation._id} className="admin-reservation-card">
              <p><strong>Vartotojas:</strong> {reservation.userId?.email || "Nežinomas"}</p>
              <p><strong>Automobilis:</strong> {reservation.carId?.brand || "Nežinomas"} {reservation.carId?.model || ""}</p>
              <p><strong>Laikotarpis:</strong> {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}</p>
              <button onClick={() => handleUpdate(reservation._id, "Patvirtinta")} className="admin-action-btn admin-btn-approve">Patvirtinti</button>
              <button onClick={() => handleUpdate(reservation._id, "Atmesta")} className="admin-action-btn admin-btn-reject">Atmesti</button>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "approved" && (
        <ul className="admin-reservation-list">
          {approvedReservations.map(reservation => (
            <li key={reservation._id} className="admin-reservation-card">
              <p>
                <strong>Vartotojas:</strong> {reservation.userId?.email || "Nežinomas"}
              </p>
              <p>
                <strong>Automobilis:</strong> {reservation.carId?.brand || "Nežinomas"} {reservation.carId?.model || ""}
              </p>
              <p>
                <strong>Laikotarpis:</strong> {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
              </p>
              <button 
                className="btn-delete" 
                onClick={() => {
                  if (window.confirm("Ar tikrai norite pašalinti šią rezervaciją?")) {
                    handleDeleteReservation(reservation._id);
                  }
                }}>
                Pašalinti
              </button>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "rejected" && (
        <ul className="admin-reservation-list">
          {rejectedReservations.map(reservation => (
            <li key={reservation._id} className="admin-reservation-card">
              <p><strong>Vartotojas:</strong> {reservation.userId?.email || "Nežinomas"}</p>
              <p><strong>Automobilis:</strong> {reservation.carId?.brand || "Nežinomas"} {reservation.carId?.model || ""}</p>
              <p><strong>Laikotarpis:</strong> {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPanel;
