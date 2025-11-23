import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./components/AdminContext";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthProvider } from "./components/AuthProvider";
import { BookingProvider } from "./components/BookingContext";
import { BookingsPage } from "./components/BookingsPage";
import { ContactPage } from "./components/ContactPage";
import { FlightsPage } from "./components/FlightsPage";
import { Homepage } from "./components/Homepage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Toaster } from "./components/ui/sonner";
import { UserDashboard } from "./components/UserDashboard";

type Page =
  | "home"
  | "login"
  | "register"
  | "admin-dashboard"
  | "user-dashboard"
  | "flights"
  | "bookings"
  | "contact";

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BookingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Toaster position="top-right" />
          </BrowserRouter>
        </BookingProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
