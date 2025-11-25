import { Bell, Menu, Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { useBookings } from "../BookingContext";
import { Input } from "../ui/input";
import { MyBookings } from "./bookings/MyBookings";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { MyFlights } from "./flights/MyFlights";
import { UserProfile } from "./profile/UserProfile";
import { Sidebar } from "./Sidebar";

type View = "dashboard" | "flights" | "bookings" | "profile";

export function UserDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = (searchParams.get("tab") as View) || "dashboard";
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const setCurrentView = (view: View) => {
    setSearchParams({ tab: view });
  };

  const { getUpcomingBookings, getPastBookings } = useBookings();
  const { user } = useAuth();

  const upcomingFlights = getUpcomingBookings();
  const recentBookings = getPastBookings().slice(0, 3);
  const totalFlights = getUpcomingBookings().length + getPastBookings().length;
  const loyaltyPoints = 3450;

  const displayName = useMemo(() => {
    if (!user) return "Guest";
    if (user.displayName) return user.displayName.split(" ")[0];
    if (user.email) return user.email.split("@")[0];
    return "User";
  }, [user]);

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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

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
              <DashboardOverview
                upcomingFlights={upcomingFlights}
                recentBookings={recentBookings}
                totalFlights={totalFlights}
                loyaltyPoints={loyaltyPoints}
                setSelectedBooking={setSelectedBooking}
                setCurrentView={setCurrentView}
              />
            )}

            {currentView === "flights" && (
              <MyFlights
                searchedBookings={searchedBookings}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSelectedBooking={setSelectedBooking}
              />
            )}

            {currentView === "bookings" && (
              <MyBookings
                searchedBookings={searchedBookings}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}

            {currentView === "profile" && (
              <UserProfile
                totalFlights={totalFlights}
                loyaltyPoints={loyaltyPoints}
              />
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
    </div>
  );
}
