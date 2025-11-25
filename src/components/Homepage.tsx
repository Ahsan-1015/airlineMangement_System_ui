import { Calendar, MapPin, Plane, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function Homepage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [flightClass, setFlightClass] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-indigo-900">SkyWings</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:flex items-center gap-8"
            >
              <button
                className="text-blue-600 hover:text-indigo-600 transition-colors"
                onClick={() => navigate("/")}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/flights")}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Flights
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Bookings
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Contact
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4">
                {user ? (
                  <Button
                    onClick={() => {
                      const role = user.role
                        ? user.role
                        : user.email
                        ? users.some(
                            (u) => u.email === user.email && u.role === "Admin"
                          )
                          ? "Admin"
                          : "User"
                        : undefined;
                      navigate(
                        role === "Admin"
                          ? "/admin"
                          : "/user-dashboard"
                      );
                    }}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-full px-6 shadow-lg"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-full px-6 shadow-lg"
                  >
                    Login
                  </Button>
                )}

                <button
                  onClick={() => setMobileMenuOpen((s) => !s)}
                  className="md:hidden p-2 rounded-lg bg-white/80 shadow-inner"
                  aria-label="Open menu"
                >
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-4 z-50 bg-white rounded-xl shadow-lg p-4 w-48">
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
          >
            Home
          </button>
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/flights");
            }}
          >
            Flights
          </button>
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/bookings");
            }}
          >
            Bookings
          </button>
          <button
            className="w-full text-left py-2"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/contact");
            }}
          >
            Contact
          </button>
          {user ? (
            <button
              className="w-full text-left py-2"
              onClick={() => {
                setMobileMenuOpen(false);
                const isAdmin = user.email
                  ? users.some(
                      (u) => u.email === user.email && u.role === "Admin"
                    )
                  : false;
                navigate(isAdmin ? "/admin" : "/user-dashboard");
              }}
            >
              Dashboard
            </button>
          ) : (
            <button
              className="w-full text-left py-2"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1584551941750-5eb4cda46c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMGZseWluZyUyMHNreXxlbnwxfHx8fDE3NjAzNDA0NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-purple-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-white text-5xl md:text-6xl mb-4">
              Explore the World
            </h1>
            <p className="text-indigo-100 text-xl">
              Book your next adventure with confidence
            </p>
          </motion.div>

          {/* Flight Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-5xl mx-auto p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-0">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* From */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="New York"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* To */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-2">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="London"
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-indigo-400"
                    />
                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Class
                  </label>
                  <Select value={flightClass} onValueChange={setFlightClass}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <SelectValue placeholder="Economy" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Search
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Plane,
              title: "500+ Destinations",
              desc: "Fly to anywhere in the world",
            },
            {
              icon: Calendar,
              title: "Easy Booking",
              desc: "Book in just a few clicks",
            },
            {
              icon: Users,
              title: "24/7 Support",
              desc: "We are here to help you",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 text-center hover:shadow-xl transition-shadow rounded-2xl border-indigo-100 hover:border-indigo-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
