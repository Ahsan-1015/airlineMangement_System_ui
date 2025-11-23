import { ArrowLeft, Clock, Filter, MapPin, Plane, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBookings } from "./BookingContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// flights are provided by AdminContext (shared central storage)
// ...existing code...
import { Flight, useAdmin } from "./AdminContext";
import { useAuth } from "./AuthProvider";
export function FlightsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users, flights } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price");
  const [filterClass, setFilterClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [passengerName, setPassengerName] = useState("John Smith");
  const [selectedSeat, setSelectedSeat] = useState("");
  const [bookingClass, setBookingClass] = useState("");
  // ...existing code...
  const { addBooking } = useBookings();

  const handleBookFlight = () => {
    if (!selectedFlight || !selectedSeat || !bookingClass || !passengerName) {
      toast.error("Please fill in all booking details");
      // ...existing code...
    }

    // build booking payload including required 'to' field
    const fromText = selectedFlight.from || "";
    const toText = selectedFlight.to || "";
    const fromCodeMatch = (selectedFlight.from || "").match(/\(([^)]+)\)/);
    const toCodeMatch = (selectedFlight.to || "").match(/\(([^)]+)\)/);

    addBooking({
      flightNumber: selectedFlight.flightNumber,
      airline: selectedFlight.airline,
      from: fromText.split(" (")[0],
      fromCode: fromCodeMatch ? fromCodeMatch[1] : "",
      to: toText.split(" (")[0],
      toCode: toCodeMatch ? toCodeMatch[1] : "",
      date: selectedFlight.date,
      time: selectedFlight.departure,
      arrival: selectedFlight.arrival,
      duration: selectedFlight.duration,
      passenger: passengerName,
      seat: selectedSeat,
      class: bookingClass,
      price: selectedFlight.price,
      status: "Confirmed",
    });

    toast.success("Flight booked successfully!", {
      description: `Booking confirmed for ${selectedFlight.flightNumber}`,
    });

    setSelectedFlight(null);
    setSelectedSeat("");
    setBookingClass("");
  };

  const getClassColor = (flightClass: string) => {
    switch (flightClass) {
      case "Economy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Business":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "First Class":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const parseDuration = (d: string) => {
    const match = (d || "").match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;
    const h = parseInt(match[1] || "0", 10);
    const m = parseInt(match[2] || "0", 10);
    return h * 60 + m;
  };

  const parseTime = (t: string) => {
    const clean = (t || "").replace(/\s*\+1$/, "").trim();
    const match = clean.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;
    let hh = parseInt(match[1], 10);
    const mm = parseInt(match[2], 10);
    const ap = match[3].toUpperCase();
    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;
    return hh * 60 + mm;
  };

  const filteredFlights = (() => {
    const q = searchQuery.trim().toLowerCase();
    const classMap: Record<string, string> = {
      economy: "Economy",
      business: "Business",
      first: "First Class",
    };

    let results = flights.filter((f: Flight) => {
      if (!q) return true;
      return [f.from, f.to, f.airline, f.flightNumber]
        .map((s) => (s || "").toString().toLowerCase())
        .some((s) => s.includes(q));
    });

    if (filterClass !== "all") {
      const want = classMap[filterClass] || filterClass;
      results = results.filter(
        (f: Flight) => (f.class || "").toString() === want
      );
    }

    results = results.slice();
    results.sort((a: Flight, b: Flight) => {
      if (sortBy === "price") return (a.price || 0) - (b.price || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "duration")
        return (
          parseDuration(a.duration || "") - parseDuration(b.duration || "")
        );
      if (sortBy === "departure")
        return parseTime(a.departure || "") - parseTime(b.departure || "");
      return 0;
    });

    return results;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-900">SkyWings</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Home
              </button>
              <button className="text-purple-600">Flights</button>
              <button
                onClick={() => navigate("/bookings")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Bookings
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Contact
              </button>
            </div>

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
                      role === "Admin" ? "/admin-dashboard" : "/user-dashboard"
                    );
                  }}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:from-purple-600 hover:via-pink-600 hover:to-fuchsia-600 text-white rounded-full px-6 shadow-lg"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:from-purple-600 hover:via-pink-600 hover:to-fuchsia-600 text-white rounded-full px-6 shadow-lg"
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
                  className="w-6 h-6 text-purple-600"
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
                navigate(isAdmin ? "/admin-dashboard" : "/user-dashboard");
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

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 py-16">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-white text-5xl mb-4">
              Find Your Perfect Flight
            </h1>
            <p className="text-purple-100 text-xl">
              Search from hundreds of destinations worldwide
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destination..."
                  className="pl-10 h-12 rounded-xl border-purple-200 focus:border-purple-400"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 rounded-xl border-purple-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-400" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="departure">Departure Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="h-12 rounded-xl border-purple-200">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>

              <Button className="h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:from-purple-600 hover:via-pink-600 hover:to-fuchsia-600 text-white rounded-xl shadow-lg">
                Search Flights
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Flights List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-gray-900">Available Flights</h2>
            <p className="text-gray-600">
              Showing {filteredFlights.length} flights
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {filteredFlights.map((flight: Flight, index: number) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 rounded-3xl border-0 bg-white/80 backdrop-blur-sm hover:bg-white group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Flight Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* From */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                          <Plane className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-gray-600">{flight.airline}</p>
                          <Badge className="bg-purple-100 text-purple-700 border-0 mt-1">
                            {flight.flightNumber}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-gray-900 mb-1">
                        {flight.departure}
                      </div>
                      <p className="text-gray-600">{flight.from}</p>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px w-12 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                        <Clock className="w-5 h-5 text-purple-500" />
                        <div className="h-px w-12 bg-gradient-to-r from-pink-400 to-fuchsia-400"></div>
                      </div>
                      <p className="text-purple-600 mb-1">{flight.duration}</p>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        {flight.stops}
                      </Badge>
                    </div>

                    {/* To */}
                    <div className="text-right md:text-left lg:text-right">
                      <div className="flex items-center justify-end gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-gray-700">{flight.rating}</span>
                        </div>
                      </div>
                      <div className="text-gray-900 mb-1">{flight.arrival}</div>
                      <p className="text-gray-600">{flight.to}</p>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-purple-100 lg:pl-6">
                    <div className="text-center lg:text-right">
                      <Badge className={`mb-2 ${getClassColor(flight.class)}`}>
                        {flight.class}
                      </Badge>
                      <div className="text-gray-600">from</div>
                      <div className="text-gray-900">${flight.price}</div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:from-purple-600 hover:via-pink-600 hover:to-fuchsia-600 text-white rounded-xl px-8 shadow-lg group-hover:shadow-xl transition-all"
                      onClick={() => {
                        if (!user) {
                          // require login before booking
                          navigate("/login");
                          return;
                        }
                        // prefill passenger name from auth user
                        setPassengerName(user.displayName ?? user.email ?? "");
                        setSelectedFlight(flight);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog
        open={selectedFlight !== null}
        onOpenChange={() => setSelectedFlight(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Your Flight</DialogTitle>
            <DialogDescription>
              Please fill in the details to complete your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Passenger Name</Label>
              <Input
                id="name"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seat">Select Seat</Label>
              <Select
                value={selectedSeat}
                onValueChange={setSelectedSeat}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a seat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <Select
                value={bookingClass}
                onValueChange={setBookingClass}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 hover:from-purple-600 hover:via-pink-600 hover:to-fuchsia-600 text-white rounded-xl px-8 shadow-lg group-hover:shadow-xl transition-all"
              onClick={handleBookFlight}
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
