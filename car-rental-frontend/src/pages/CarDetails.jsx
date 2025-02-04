import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "../styles/calendarStyles.css";
import "../styles/carDetails.css";

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [bookedDates, setBookedDates] = useState(new Set());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/cars/${id}`)
            .then((res) => {
                if (res.data.status === "Juodraštis" && !localStorage.getItem("isAdmin")) {
                    navigate("/");
                } else {
                    setCar(res.data);
                }
            })
            .catch((err) => console.error("Klaida gaunant automobilį:", err));


        axios.get(`http://localhost:5000/api/reservations/booked-dates/${id}`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setBookedDates(new Set(res.data));
                } else {
                    console.error("Netinkamas užimtų datų formatas:", res.data);
                }
            })
            .catch((err) => console.error("Klaida gaunant užimtas datas:", err.response?.data || err));

        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:5000/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
                .then(() => setIsLoggedIn(true))
                .catch(() => setIsLoggedIn(false));
        } else {
            setIsLoggedIn(false);
        }
    }, [id, navigate]);

    const isBooked = (date) => bookedDates.has(date.toISOString().split("T")[0]);

    const calculateTotalPrice = () => {
        if (car && startDate && endDate) {
            const dayDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const price = dayDifference > 0 ? dayDifference * car.pricePerDay : 0;
            setTotalPrice(price);
        }
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [startDate, endDate, car]);

    const handleReservation = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Norėdami rezervuoti, turite prisijungti!");
            return navigate("/login");
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/reservations",
                {
                    carId: id,
                    startDate,
                    endDate
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ text: "Rezervacija sėkminga!", type: "success" });
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Įvyko klaida rezervuojant automobilį.",
                type: "error"
            });
        }
    };

    return (
        <div className="car-details-container">
            {car ? (
                <>
                    <h2>{car.brand} {car.model}</h2>
                    <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-details-image" />

                    <div className="car-details-info">
                        <p><strong>Kuro tipas:</strong> {car.fuelType}</p>
                        <p><strong>Pavarų dėžė:</strong> {car.transmission}</p>
                        <p><strong>Sedimų vietų:</strong> {car.passengerCapacity}</p>
                        <p><strong>Kaina per dieną:</strong> {car.pricePerDay} €</p>
                        <p><strong>Aprašymas:</strong> {car.description}</p>
                    </div>

                    <h3>Pasirinkite datą</h3>
                    <div className="car-calendar-section">
                        <div>
                            <strong>NUO:</strong>
                            <Calendar
                                className="custom-calendar"
                                locale="lt-LT"
                                onChange={setStartDate}
                                value={startDate}
                                tileDisabled={({ date }) => isBooked(date) || date < new Date()}
                                tileClassName={({ date, view }) => {
                                    if (view === 'month' && startDate && endDate && date > startDate && date < endDate) {
                                        return 'selected-range';
                                    }
                                    return null;
                                }}
                            />

                        </div>
                        <div>
                            <strong>IKI:</strong>
                            <Calendar
                                className="custom-calendar"
                                locale="lt-LT"
                                onChange={setEndDate}
                                value={endDate}
                                tileDisabled={({ date }) => isBooked(date) || date <= startDate}
                                tileClassName={({ date, view }) => {
                                    if (view === 'month' && startDate && endDate && date > startDate && date < endDate) {
                                        return 'selected-range';
                                    }
                                    return null;
                                }}
                            />

                        </div>
                    </div>

                    {totalPrice > 0 && (
                        <p><strong>Bendra kaina:</strong> {totalPrice} €</p>
                    )}

                    {message && (
                        <div className={`reservation-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {isLoggedIn ? (
                        <button className="car-reserve-btn" onClick={handleReservation}>Rezervuoti</button>
                    ) : (
                        <button className="car-login-btn" onClick={() => navigate("/login")}>Prisijungti, kad rezervuotumėte</button>
                    )}
                </>
            ) : (
                <p>Kraunama...</p>
            )}
        </div>
    );
};

export default CarDetails;
