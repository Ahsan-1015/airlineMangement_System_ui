import {
  ArrowRight,
  Award,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Plane,
  Search,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useBookings } from "./BookingContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
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

type View = "dashboard" | "flights" | "bookings" | "profile";

export function UserDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const initials = useMemo(() => {
    if (!user) return "G";
    const source = user.displayName ?? user.email ?? "";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "G";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);
  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "—";
    try {
      const d = new Date(user.createdAt);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return user.createdAt;
    }
  }, [user?.createdAt]);
  const displayName = useMemo(() => {
    if (!user) return "Guest";
    if (user.displayName) return user.displayName.split(" ")[0];
    if (user.email) return user.email.split("@")[0];
    return "Guest";
  }, [user]);
  const [searchQuery, setSearchQuery] = useState("");
  const truncate = (s?: string | null, n = 12) => {
    if (!s) return s;
    return s.length > n ? s.slice(0, n) + "..." : s;
  };

  const truncatedEmail = useMemo(
    () => truncate(user?.email ?? null, 12),
    [user?.email]
  );
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const { getUpcomingBookings, getPastBookings, cancelBooking } = useBookings();

  const upcomingFlights = getUpcomingBookings();
  const recentBookings = getPastBookings().slice(0, 3);

  const totalFlights = getUpcomingBookings().length + getPastBookings().length;
  const loyaltyPoints = 3450;

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", value: "dashboard" as View },
    { icon: Plane, label: "My Flights", value: "flights" as View },
    { icon: Calendar, label: "My Bookings", value: "bookings" as View },
    { icon: User, label: "Profile", value: "profile" as View },
  ];

  const quickStats = [
    {
      label: "Total Flights",
      value: totalFlights.toString(),
      icon: Plane,
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "Loyalty Points",
      value: loyaltyPoints.toLocaleString(),
      icon: Award,
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      label: "Upcoming",
      value: upcomingFlights.length.toString(),
      icon: Calendar,
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      label: "This Year",
      value: "8",
      icon: CheckCircle,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const handleCancelBooking = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setBookingToCancel(null);
      setSelectedBooking(null);
    }
  };

  const filteredBookings =
    currentView === "flights"
      ? upcomingFlights
      : [...upcomingFlights, ...getPastBookings()];

  const searchedBookings = searchQuery
    ? filteredBookings.filter(
        (b) =>
          b.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredBookings;

  return (
    <div className="flex h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            to={"/"}
            className="flex items-center justify-between p-6 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <Link to="/" className="text-violet-900 hover:underline">
                SkyWings
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </Link>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? "avatar"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-900">
                  {user?.displayName ?? user?.email ?? "Guest User"}
                </div>
                <div className="text-xs text-gray-500">
                  {truncatedEmail ?? "Member"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setCurrentView(item.value);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.value
                    ? "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={async () => {
                try {
                  await signOut?.();
                } catch (e) {
                  // ignore sign out errors here; optionally show toast
                }
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-gray-900">
                  {currentView === "dashboard" && "My Dashboard"}
                  {currentView === "flights" && "My Flights"}
                  {currentView === "bookings" && "My Bookings"}
                  {currentView === "profile" && "My Profile"}
                </h1>
                <p className="text-gray-500">Welcome back, {displayName}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookings..."
                  className="pl-10 w-64 rounded-xl border-gray-200"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow rounded-2xl border-0 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}
                          >
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="text-gray-600 mb-1">{stat.label}</div>
                        <div className="text-gray-900">{stat.value}</div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Upcoming Flights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <Card className="rounded-2xl border-0 bg-white shadow-sm">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-gray-900">Upcoming Flights</h2>
                          <p className="text-gray-500">
                            Your confirmed bookings
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate("/flights")}
                          className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl shadow-lg"
                        >
                          Book New Flight
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {upcomingFlights.length === 0 ? (
                        <div className="text-center py-12">
                          <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No upcoming flights</p>
                          <Button
                            onClick={() => navigate("/flights")}
                            variant="ghost"
                            className="mt-4 text-violet-600 hover:text-violet-700"
                          >
                            Browse Flights
                          </Button>
                        </div>
                      ) : (
                        upcomingFlights.slice(0, 2).map((flight, index) => (
                          <motion.div
                            key={flight.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <Badge className="bg-green-100 text-green-700 border-0 mb-2">
                                  {flight.status}
                                </Badge>
                                <div className="text-sm text-gray-600">
                                  Booking ID: {flight.id}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-600">
                                  Flight
                                </div>
                                <div className="text-gray-900">
                                  {flight.flightNumber}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex-1">
                                <div className="text-gray-900 mb-1">
                                  {flight.from}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {flight.fromCode}
                                </div>
                              </div>
                              <div className="flex-1 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-violet-600">
                                  <div className="h-px w-16 bg-violet-300"></div>
                                  <Plane className="w-5 h-5" />
                                  <div className="h-px w-16 bg-violet-300"></div>
                                </div>
                              </div>
                              <div className="flex-1 text-right">
                                <div className="text-gray-900 mb-1">
                                  {flight.to}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {flight.toCode}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-violet-200">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{flight.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{flight.time}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <Badge className="bg-violet-100 text-violet-700 border-0">
                                  Seat {flight.seat}
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-700 border-0">
                                  {flight.class}
                                </Badge>
                              </div>
                            </div>

                            <Button
                              onClick={() => setSelectedBooking(flight)}
                              className="w-full mt-4 bg-white text-violet-600 hover:bg-violet-50 border border-violet-200 rounded-xl"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card className="rounded-2xl border-0 bg-white shadow-sm">
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-gray-900">Recent Bookings</h2>
                        <p className="text-gray-500">
                          {recentBookings.length === 0
                            ? "No bookings yet"
                            : `Showing ${recentBookings.length} recent booking${
                                recentBookings.length !== 1 ? "s" : ""
                              }`}
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {recentBookings.map((booking, index) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.05 }}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center">
                                  <Plane className="w-5 h-5 text-violet-600" />
                                </div>
                                <div>
                                  <div className="text-gray-900">
                                    {booking.from} → {booking.to}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.date}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-gray-900 mb-1">
                                  ${booking.price}
                                </div>
                                <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                                  {booking.status}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <Button
                          onClick={() => setCurrentView("bookings")}
                          variant="ghost"
                          className="w-full mt-4 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                        >
                          View All Bookings
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Loyalty Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Card className="p-6 rounded-2xl border-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-xl h-full">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="mb-2">Loyalty Rewards</h3>
                          <p className="text-violet-100">Premium Member</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Award className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="text-sm text-violet-100 mb-2">
                          Current Points
                        </div>
                        <div className="text-3xl mb-4">
                          {loyaltyPoints.toLocaleString()} pts
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{ width: "68%" }}
                          ></div>
                        </div>
                        <div className="text-sm text-violet-100 mt-2">
                          1,550 pts to Gold Status
                        </div>
                      </div>

                      <Button className="w-full bg-white text-violet-600 hover:bg-violet-50 rounded-xl">
                        Redeem Points
                      </Button>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {(currentView === "flights" || currentView === "bookings") && (
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-6">
                  <h2 className="text-gray-900 mb-2">
                    {currentView === "flights"
                      ? "My Upcoming Flights"
                      : "All My Bookings"}
                  </h2>
                  <p className="text-gray-500">
                    {currentView === "flights"
                      ? `You have ${searchedBookings.length} upcoming flight${
                          searchedBookings.length !== 1 ? "s" : ""
                        }`
                      : `Showing ${searchedBookings.length} booking${
                          searchedBookings.length !== 1 ? "s" : ""
                        }`}
                  </p>
                </div>

                <div className="space-y-4">
                  {searchedBookings.length === 0 ? (
                    <Card className="p-12 text-center rounded-2xl">
                      <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        {searchQuery
                          ? "No bookings match your search"
                          : "No bookings found"}
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          navigate("/flights");
                        }}
                        className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl"
                      >
                        Book a Flight
                      </Button>
                    </Card>
                  ) : (
                    searchedBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-6 hover:shadow-xl transition-all rounded-2xl border-0 bg-white">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Plane className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-gray-900">
                                      {booking.flightNumber}
                                    </div>
                                    <p className="text-gray-600">
                                      ID: {booking.id}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    booking.status === "Confirmed"
                                      ? "bg-green-100 text-green-700 border-0"
                                      : booking.status === "Pending"
                                      ? "bg-amber-100 text-amber-700 border-0"
                                      : booking.status === "Cancelled"
                                      ? "bg-red-100 text-red-700 border-0"
                                      : "bg-blue-100 text-blue-700 border-0"
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="text-gray-900 mb-1">
                                    {booking.from}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.fromCode}
                                  </div>
                                </div>
                                <div className="flex-1 flex items-center justify-center">
                                  <div className="h-px flex-1 bg-violet-300"></div>
                                  <Plane className="w-5 h-5 text-violet-600 mx-2" />
                                  <div className="h-px flex-1 bg-violet-300"></div>
                                </div>
                                <div className="flex-1 text-right">
                                  <div className="text-gray-900 mb-1">
                                    {booking.to}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.toCode}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{booking.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{booking.time}</span>
                                </div>
                                <Badge className="bg-violet-100 text-violet-700 border-0">
                                  {booking.seat} • {booking.class}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-end lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0 border-t lg:border-t-0">
                              <div className="text-right mb-4">
                                <p className="text-gray-600 mb-1">Total</p>
                                <div className="text-gray-900">
                                  ${booking.price}
                                </div>
                              </div>
                              <Button
                                onClick={() => setSelectedBooking(booking)}
                                className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {currentView === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-8 rounded-2xl">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-100 flex items-center justify-center border-4 border-red shadow-lg ">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL ?? undefined}
                          alt={user.displayName ?? user.email ?? ""}
                          className="w-24 h-24 object-cover rounded-full border-4 border-red shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-3xl">
                          {initials}
                        </div>
                      )}
                    </div>
                    <h2 className="text-gray-900 mb-2">
                      {user?.displayName ?? user?.email ?? "Guest User"}
                    </h2>
                    <p className="text-gray-500">
                      {user?.email ?? "Not available"}
                    </p>
                    <Badge className="mt-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
                      Premium Member
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-600 mb-1">Member Since</p>
                      <p className="text-gray-900">{memberSince}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-600 mb-1">Total Flights</p>
                      <p className="text-gray-900">{totalFlights} flights</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-600 mb-1">Loyalty Points</p>
                      <p className="text-gray-900">
                        {loyaltyPoints.toLocaleString()} pts
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-600 mb-1">Member Status</p>
                      <p className="text-gray-900">Premium</p>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <Button className="flex-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl">
                      Change Password
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Booking Details Dialog */}
      <Dialog
        open={selectedBooking !== null}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>
                  Booking ID: {selectedBooking.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-900">
                        {selectedBooking.flightNumber}
                      </div>
                      <p className="text-sm text-gray-600">
                        {selectedBooking.airline}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      selectedBooking.status === "Confirmed"
                        ? "bg-green-100 text-green-700 border-0"
                        : selectedBooking.status === "Pending"
                        ? "bg-amber-100 text-amber-700 border-0"
                        : selectedBooking.status === "Cancelled"
                        ? "bg-red-100 text-red-700 border-0"
                        : "bg-blue-100 text-blue-700 border-0"
                    }
                  >
                    {selectedBooking.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-violet-500" />
                      <p className="text-gray-600">From</p>
                    </div>
                    <p className="text-gray-900">{selectedBooking.from}</p>
                    <p className="text-sm text-gray-500">
                      {selectedBooking.fromCode}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-violet-500" />
                      <p className="text-gray-600">To</p>
                    </div>
                    <p className="text-gray-900">{selectedBooking.to}</p>
                    <p className="text-sm text-gray-500">
                      {selectedBooking.toCode}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-violet-500" />
                      <p className="text-gray-600">Date</p>
                    </div>
                    <p className="text-gray-900">{selectedBooking.date}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-violet-500" />
                      <p className="text-gray-600">Time</p>
                    </div>
                    <p className="text-gray-900">{selectedBooking.time}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-violet-500" />
                      <p className="text-gray-600">Passenger</p>
                    </div>
                    <p className="text-gray-900">{selectedBooking.passenger}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 mb-2">Seat & Class</p>
                    <div className="flex gap-2">
                      <Badge className="bg-violet-100 text-violet-700 border-0">
                        Seat {selectedBooking.seat}
                      </Badge>
                      <Badge className="bg-purple-100 text-purple-700 border-0">
                        {selectedBooking.class}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl">
                  <div className="flex items-center justify-between">
                    <span>Total Price</span>
                    <span className="text-2xl">${selectedBooking.price}</span>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                {selectedBooking.status === "Confirmed" && (
                  <>
                    <Button className="flex-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download Ticket
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setBookingToCancel(selectedBooking.id);
                      }}
                    >
                      Cancel Booking
                    </Button>
                  </>
                )}
                {selectedBooking.status === "Completed" && (
                  <Button className="flex-1" variant="outline">
                    View Receipt
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation */}
      <AlertDialog
        open={bookingToCancel !== null}
        onOpenChange={() => setBookingToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone. Cancellation fees may apply based on the airline's
              policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
