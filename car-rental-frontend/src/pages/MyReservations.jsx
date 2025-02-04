import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/myReservations.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState(new Set());
  const [expandedReservation, setExpandedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Turite prisijungti norėdami matyti savo rezervacijas.");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/reservations/my-reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(res.data);
    } catch (err) {
      console.error("Klaida gaunant rezervacijas:", err);
    }
  };

  const fetchBookedDates = async (carId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reservations/booked-dates/${carId}`);
      if (Array.isArray(res.data)) {
        setBookedDates(new Set(res.data));
      }
    } catch (err) {
      console.error("Klaida gaunant užimtas datas:", err);
    }
  };

  const cancelReservation = async (id, status) => {
    if (status === "Patvirtinta") {
      toast.warning("Patvirtintos rezervacijos atšaukti negalima.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Rezervacija atšaukta.");
      window.location.reload();
    } catch (err) {
      console.error("Klaida atšaukiant rezervaciją:", err);
      toast.error("Nepavyko atšaukti rezervacijos. Bandykite dar kartą.");
    }
  };
  
  



  const handleUpdateClick = async (reservation) => {
    if (reservation.status === "Patvirtinta") {
      toast.warning("Negalite keisti datos, nes rezervacija jau patvirtinta.");
      return;
    }

    setSelectedReservation(reservation);
    setStartDate(new Date(reservation.startDate));
    setEndDate(new Date(reservation.endDate));
    setShowCalendar(true);
    await fetchBookedDates(reservation.carId._id);
  };

  const isDateAvailable = (start, end) => {
    return !Array.from(bookedDates).some(date => {
      const bookedDate = new Date(date);
      return bookedDate >= start && bookedDate <= end;
    });
  };

  const updateReservation = async () => {
    if (!selectedReservation) {
      toast.error("Nepasirinkta rezervacija atnaujinimui.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Jūsų sesija baigėsi, prisijunkite iš naujo.");
      return;
    }

    if (endDate <= startDate) {
      toast.warning("Pabaigos data turi būti vėlesnė nei pradžios data.");
      return;
    }

    if (!isDateAvailable(startDate, endDate)) {
      toast.error("Pasirinktos datos jau užimtos! Pabandykite kitą laikotarpį.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/reservations/${selectedReservation._id}`,
        { startDate, endDate, carId: selectedReservation.carId._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Rezervacija atnaujinta.");
        setShowCalendar(false);
        fetchReservations();
      } else {
        toast.error("Serverio klaida. Bandykite dar kartą.");
      }
    } catch (err) {
      console.error("Klaida keičiant rezervacijos datą:", err.response?.data || err);
      toast.error(`Nepavyko atnaujinti rezervacijos. Klaida: ${err.response?.data?.message || "Nežinoma klaida"}`);
    }
  };

  return (
    <div className="my-reservations-container">
      <h2>Mano rezervacijos</h2>
      {reservations.length === 0 ? (
        <p>Neturite aktyvių rezervacijų.</p>
      ) : (
        <ul className="reservations-list">
          {reservations.map((res) => (
            <li key={res._id} className="reservation-item">
              <div className="reservation-header" onClick={() => setExpandedReservation(expandedReservation === res._id ? null : res._id)}>
                <img src={res.carId.image} alt={res.carId.brand} />
                <h3>{res.carId.brand} {res.carId.model}</h3>
                <p><strong>Būsena:</strong> {res.status}</p>
              </div>
              {expandedReservation === res._id && (
                <div className="reservation-details">
                  <p><strong>Nuo:</strong> {new Date(res.startDate).toLocaleDateString()}</p>
                  <p><strong>Iki:</strong> {new Date(res.endDate).toLocaleDateString()}</p>
                  <div className="reservation-actions">
                  {res.status !== "Patvirtinta" && (
  <>
    <button className="btn-update" onClick={() => handleUpdateClick(res)}>
      Keisti datą
    </button>
    <button className="btn-cancel" onClick={() => cancelReservation(res._id, res.status)}>
  Atšaukti
</button>

  </>
)}

</div>

                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showCalendar && (
        <div className="modal">
          <div className="modal-content">
            <h3>Pasirinkite naujas datas</h3>
            <p>Pradžios data:</p>
            <Calendar
              onChange={setStartDate}
              value={startDate}
              minDate={new Date()}
              tileDisabled={({ date }) => bookedDates.has(date.toISOString().split("T")[0]) || date < new Date()}
            />
            <p>Pabaigos data:</p>
            <Calendar
              onChange={setEndDate}
              value={endDate}
              minDate={startDate}
              tileDisabled={({ date }) => bookedDates.has(date.toISOString().split("T")[0]) || date <= startDate}
            />
            <button className="btn btn-success" onClick={updateReservation}>Išsaugoti</button>
            <button className="btn btn-danger" onClick={() => setShowCalendar(false)}>Atšaukti</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
