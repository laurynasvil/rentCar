import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import MyReservations from "./pages/MyReservations";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/my-reservations" element={<MyReservations />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/admin/cars/edit/:id" element={<EditCar />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />


      </Routes>
      <Footer />
    </>
  );
}

export default App;
