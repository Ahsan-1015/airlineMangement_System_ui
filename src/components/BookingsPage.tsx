import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  MapPin,
  Plane,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";
import { useAuth } from "./AuthProvider";
import { Booking, useBookings } from "./BookingContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Bookings are provided by BookingContext; we'll use the context helpers below

export function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { users } = useAdmin();
  const {
    getUpcomingBookings,
    getPastBookings,
    getCancelledBookings,
    cancelBooking,
    addBooking,
    updateBookingStatus,
  } = useBookings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const bookings = getUpcomingBookings();
  const pastBookings = getPastBookings();
  const cancelledBookings = getCancelledBookings();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "Pending":
        return <Clock className="w-5 h-5" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getClassColor = (flightClass: string) => {
    switch (flightClass) {
      case "Economy":
        return "bg-cyan-100 text-cyan-700";
      case "Business":
        return "bg-purple-100 text-purple-700";
      case "First Class":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="p-6 hover:shadow-2xl transition-all duration-300 rounded-3xl border-0 bg-white/80 backdrop-blur-sm hover:bg-white group">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-gray-900">{booking.flightNumber}</div>
                <p className="text-gray-600">Booking ID: {booking.id}</p>
              </div>
            </div>
            <Badge
              className={`flex items-center gap-1 ${getStatusColor(
                booking.status
              )}`}
            >
              {getStatusIcon(booking.status)}
              {booking.status}
            </Badge>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 mb-1">From</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span className="text-gray-900">{booking.from}</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-400 to-indigo-400"></div>
              <Plane className="w-5 h-5 text-indigo-500 mx-2" />
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
            </div>
            <div>
              <p className="text-gray-600 mb-1">To</p>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span className="text-gray-900">{booking.to}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <span className="text-gray-900">{booking.date}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Time</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span className="text-gray-900">{booking.time}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Passenger</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-500" />
                <span className="text-gray-900">{booking.passenger}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Seat</p>
              <Badge className={`${getClassColor(booking.class)} border-0`}>
                {booking.seat} • {booking.class}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between items-end lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0">
          <div className="text-right mb-4">
            <p className="text-gray-600 mb-1">Total Price</p>
            <div className="text-gray-900">${booking.price}</div>
          </div>
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            {booking.status === "Confirmed" && (
              <>
                <Button
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white rounded-xl shadow-lg"
                  onClick={() => downloadTicket(booking)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Ticket
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel Booking
                </Button>
              </>
            )}
            {booking.status === "Pending" && (
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow-lg"
                onClick={() => handleCompletePayment(booking.id)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Payment
              </Button>
            )}
            {booking.status === "Completed" && (
              <Button
                variant="outline"
                className="rounded-xl border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                onClick={() => downloadReceipt(booking)}
              >
                View Receipt
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  const downloadTicket = (booking: Booking) => {
    try {
      const content = `Ticket\nBooking ID: ${booking.id}\nPassenger: ${booking.passenger}\nFlight: ${booking.flightNumber} (${booking.airline})\nFrom: ${booking.from} (${booking.fromCode})\nTo: ${booking.to} (${booking.toCode})\nDate: ${booking.date} ${booking.time}\nSeat: ${booking.seat}\nClass: ${booking.class}`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${booking.id}-ticket.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Ticket downloaded");
    } catch (err) {
      toast.error("Unable to download ticket");
    }
  };

  const downloadReceipt = (booking: Booking) => {
    try {
      const receipt = {
        id: booking.id,
        passenger: booking.passenger,
        flight: booking.flightNumber,
        amount: booking.price,
        date: booking.bookingDate,
      };
      const blob = new Blob([JSON.stringify(receipt, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${booking.id}-receipt.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Receipt downloaded");
    } catch (err) {
      toast.error("Unable to download receipt");
    }
  };

  const handleCancel = (id: string) => {
    const ok = window.confirm("Are you sure you want to cancel this booking?");
    if (!ok) return;
    cancelBooking(id);
    toast.success("Booking cancelled");
  };

  const handleCompletePayment = (id: string) => {
    updateBookingStatus(id, "Confirmed");
    toast.success("Payment completed — booking confirmed");
  };

  const insertSampleUpcoming = () => {
    // build a booking for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().split("T")[0];

    const sample = {
      flightNumber: "SW-205",
      airline: "SkyWings Premium",
      from: "Los Angeles",
      fromCode: "LAX",
      to: "Tokyo",
      toCode: "NRT",
      date: iso,
      time: "2:45 PM",
      arrival: "6:30 PM +1",
      duration: "11h 45m",
      passenger: user?.displayName ?? user?.email ?? "Guest",
      seat: "8C",
      class: "Business",
      price: 1200,
      status: "Confirmed" as const,
    };

    try {
      addBooking(sample);
      toast.success("Inserted sample upcoming booking");
      setActiveTab("upcoming");
    } catch (err) {
      toast.error("Unable to insert sample booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-cyan-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <span className="text-indigo-900">SkyWings</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/flights")}
                className="text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Flights
              </button>
              <button className="text-cyan-600">Bookings</button>
              <button
                onClick={() => navigate("/contact")}
                className="text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Contact
              </button>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Button
                  onClick={() => {
                    const isAdmin = user.email
                      ? users.some(
                          (u) => u.email === user.email && u.role === "Admin"
                        )
                      : false;
                    navigate(isAdmin ? "/admin-dashboard" : "/user-dashboard");
                  }}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white rounded-full px-6 shadow-lg"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white rounded-full px-6 shadow-lg"
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
                  className="w-6 h-6 text-cyan-600"
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
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 py-16">
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
            <h1 className="text-white text-5xl mb-4">My Bookings</h1>
            <p className="text-cyan-100 text-xl">
              Manage all your flight reservations in one place
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-lg border-0">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl"
              >
                Upcoming ({bookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl"
              >
                Past ({pastBookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-xl"
              >
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {bookings.length === 0 ? (
                <Card className="p-6 rounded-2xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-gray-900 text-lg font-medium">
                        No upcoming bookings found
                      </h3>
                      <p className="text-gray-600">
                        You don't have any bookings scheduled for the future.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={insertSampleUpcoming}
                        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white"
                      >
                        Insert Sample Upcoming Booking
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                bookings.map((booking: Booking, index: number) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BookingCard booking={booking} />
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastBookings.map((booking: Booking, index: number) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookingCard booking={booking} />
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-6">
              {cancelledBookings.map((booking: Booking, index: number) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookingCard booking={booking} />
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
