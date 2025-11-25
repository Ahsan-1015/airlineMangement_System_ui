import { Menu, Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAdmin } from "../AdminContext";
import { useAuth } from "../AuthProvider";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { FlightManagement } from "./flights/FlightManagement";
import { ReportsAnalytics } from "./reports/ReportsAnalytics";
import { SystemSettings } from "./settings/SystemSettings";
import { Sidebar } from "./Sidebar";
import { UserManagement } from "./users/UserManagement";

type View = "dashboard" | "flights" | "users" | "reports" | "settings";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = (searchParams.get("tab") as View) || "dashboard";
  const [searchQuery, setSearchQuery] = useState("");

  const setCurrentView = (view: View) => {
    setSearchParams({ tab: view });
  };

  const {
    flights,
    users,
    usersSource,
    reloadUsers,
    getSystemStats,
  } = useAdmin();

  const stats = getSystemStats();

  const filteredFlights = searchQuery
    ? flights.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.to.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flights;

  const filteredUsers = searchQuery
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "On Time":
        return "bg-green-100 text-green-700 border-green-200";
      case "Delayed":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Cancelled":
      case "Suspended":
        return "bg-red-100 text-red-700 border-red-200";
      case "Scheduled":
      case "Inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const isAdmin = user?.role === "Admin";

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSearchQuery={setSearchQuery}
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
                  {currentView === "dashboard" && "Dashboard Overview"}
                  {currentView === "flights" && "Flight Management"}
                  {currentView === "users" && "User Management"}
                  {currentView === "reports" && "Reports & Analytics"}
                  {currentView === "settings" && "System Settings"}
                </h1>
                <p className="text-gray-500">SkyWings Airlines Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {(currentView === "flights" || currentView === "users") && (
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${currentView}...`}
                    className="pl-10 w-64 rounded-xl border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isAdmin ? (
            <AnimatePresence mode="wait">
              {currentView === "dashboard" && (
                <DashboardOverview
                  stats={stats}
                  flights={flights}
                  users={users}
                  setCurrentView={setCurrentView}
                  getStatusColor={getStatusColor}
                />
              )}

              {currentView === "flights" && (
                <FlightManagement
                  filteredFlights={filteredFlights}
                  getStatusColor={getStatusColor}
                />
              )}

              {currentView === "users" && (
                <UserManagement
                  filteredUsers={filteredUsers}
                  usersSource={usersSource}
                  reloadUsers={reloadUsers}
                  getStatusColor={getStatusColor}
                />
              )}

              {currentView === "reports" && (
                <ReportsAnalytics
                  stats={stats}
                  flights={flights}
                  users={users}
                />
              )}

              {currentView === "settings" && <SystemSettings />}
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <Card className="max-w-xl w-full text-center p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Access restricted
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  This area is for administrators only. Your account does not
                  have the required privileges.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Go to Home
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await (window as any).authSignOut?.();
                      } catch (e) {
                        // fallback: navigate home
                      }
                      navigate("/");
                    }}
                    className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 text-white rounded-xl"
                  >
                    Sign Out
                  </Button>
                </div>
              </Card>
            </div>
          )}
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
