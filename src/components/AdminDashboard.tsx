import {
  Activity,
  BarChart3,
  Clock,
  DollarSign,
  Download,
  Edit,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Plane,
  PlusCircle,
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Flight, useAdmin, User } from "./AdminContext";
import { useAuth } from "./AuthProvider";
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
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type View = "dashboard" | "flights" | "users" | "reports" | "settings";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Flight management states
  const [flightDialogOpen, setFlightDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [flightToDelete, setFlightToDelete] = useState<number | null>(null);

  // User management states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const {
    flights,
    users,
    addFlight,
    usersSource,
    reloadUsers,
    updateFlight,
    deleteFlight,
    updateUser,
    deleteUser,
    getSystemStats,
  } = useAdmin();

  const stats = getSystemStats();

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", value: "dashboard" as View },
    { icon: Plane, label: "Manage Flights", value: "flights" as View },
    { icon: Users, label: "User Management", value: "users" as View },
    { icon: FileText, label: "Reports", value: "reports" as View },
    { icon: Settings, label: "Settings", value: "settings" as View },
  ];

  const quickStats = [
    {
      label: "Total Flights",
      value: stats.totalFlights.toString(),
      change: "+12%",
      icon: Plane,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+18%",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "On-Time Rate",
      value: `${stats.onTimeRate.toFixed(0)}%`,
      change: "+2%",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Revenue",
      value: `$${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: "+15%",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Flight form state
  const [flightForm, setFlightForm] = useState<Omit<Flight, "id">>({
    airline: "",
    flightNumber: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    duration: "",
    date: "",
    price: 0,
    class: "Economy",
    stops: "Non-stop",
    rating: 4.5,
    status: "Scheduled",
    aircraft: "",
    capacity: 0,
    booked: 0,
  });

  const handleAddFlight = () => {
    setEditingFlight(null);
    setFlightForm({
      airline: "SkyWings Airways",
      flightNumber: "",
      from: "",
      to: "",
      departure: "",
      arrival: "",
      duration: "",
      date: "",
      price: 0,
      class: "Economy",
      stops: "Non-stop",
      rating: 4.5,
      status: "Scheduled",
      aircraft: "",
      capacity: 0,
      booked: 0,
    });
    setFlightDialogOpen(true);
  };

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight);
    setFlightForm(flight);
    setFlightDialogOpen(true);
  };

  const handleSaveFlight = () => {
    if (!flightForm.flightNumber || !flightForm.from || !flightForm.to) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingFlight) {
      updateFlight(editingFlight.id, flightForm);
      toast.success("Flight updated successfully");
    } else {
      addFlight(flightForm);
      toast.success("Flight added successfully");
    }

    setFlightDialogOpen(false);
  };

  const handleDeleteFlight = () => {
    if (flightToDelete !== null) {
      deleteFlight(flightToDelete);
      toast.success("Flight deleted successfully");
      setFlightToDelete(null);
    }
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      toast.success("User removed successfully");
      setUserToDelete(null);
    }
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    updateUser(userId, { status: newStatus as "Active" | "Suspended" });
    toast.success(`User ${newStatus.toLowerCase()}`);
  };

  const handleToggleUserRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === "Admin" ? "User" : "Admin";
    updateUser(userId, { role: newRole as "User" | "Admin" });
    toast.success(`Role updated to ${newRole}`);
  };

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
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-orange-900">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Admin Profile */}
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
                  <div className="w-full h-full bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 flex items-center justify-center text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-gray-900">
                  {user?.displayName ?? user?.email ?? "Administrator"}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email ?? "System Admin"}
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
                  setSearchQuery("");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentView === item.value
                    ? "bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 text-white shadow-lg"
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
              onClick={() => navigate("/")}
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
              {/* Dashboard View */}
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
                            <Badge className="bg-green-100 text-green-700 border-0">
                              {stat.change}
                            </Badge>
                          </div>
                          <div className="text-gray-600 mb-1">{stat.label}</div>
                          <div className="text-gray-900">{stat.value}</div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card className="rounded-2xl border-0 bg-white shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-gray-900">Recent Flights</h2>
                              <p className="text-gray-500">
                                Latest flight operations
                              </p>
                            </div>
                            <Button
                              onClick={() => setCurrentView("flights")}
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white rounded-xl"
                            >
                              View All
                            </Button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {flights.slice(0, 4).map((flight, index) => (
                              <motion.div
                                key={flight.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                                    <Plane className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <div>
                                    <div className="text-gray-900">
                                      {flight.flightNumber}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {flight.from} → {flight.to}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  className={getStatusColor(flight.status)}
                                >
                                  {flight.status}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card className="rounded-2xl border-0 bg-white shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="text-gray-900">Active Users</h2>
                              <p className="text-gray-500">
                                Recent user activity
                              </p>
                            </div>
                            <Button
                              onClick={() => setCurrentView("users")}
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white rounded-xl"
                            >
                              View All
                            </Button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {users
                              .filter((u) => u.role === "User")
                              .slice(0, 4)
                              .map((user, index) => (
                                <motion.div
                                  key={user.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.6 + index * 0.05 }}
                                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm">
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <div>
                                      <div className="text-gray-900">
                                        {user.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {user.email}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-600">
                                      {user.totalFlights} flights
                                    </div>
                                    <Badge
                                      className={getStatusColor(user.status)}
                                      size="sm"
                                    >
                                      {user.status}
                                    </Badge>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Flights Management View */}
              {currentView === "flights" && (
                <motion.div
                  key="flights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-gray-900">Flight Management</h2>
                      <p className="text-gray-500">
                        Showing {filteredFlights.length} flight
                        {filteredFlights.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      onClick={handleAddFlight}
                      className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white rounded-xl shadow-lg"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Flight
                    </Button>
                  </div>

                  <Card className="rounded-2xl border-0 bg-white shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Flight #</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Aircraft</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFlights.map((flight) => (
                          <TableRow key={flight.id}>
                            <TableCell>
                              <div className="text-gray-900">
                                {flight.flightNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {flight.airline}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-900">{flight.from}</div>
                              <div className="text-sm text-gray-500">
                                → {flight.to}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-900">{flight.date}</div>
                              <div className="text-sm text-gray-500">
                                {flight.departure}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {flight.aircraft}
                            </TableCell>
                            <TableCell>
                              <div className="text-gray-900">
                                {flight.booked} / {flight.capacity}
                              </div>
                              <div className="text-sm text-gray-500">
                                {Math.round(
                                  (flight.booked / flight.capacity) * 100
                                )}
                                % full
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              ${flight.price}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(flight.status)}>
                                {flight.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditFlight(flight)}
                                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setFlightToDelete(flight.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </motion.div>
              )}

              {/* User Management View */}
              {currentView === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-gray-900">User Management</h2>
                      <p className="text-gray-500 flex items-center gap-3">
                        <span>
                          Showing {filteredUsers.length} user
                          {filteredUsers.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Source:{" "}
                          {usersSource === "firestore" ? "Firestore" : "Local"}
                        </span>
                        {usersSource !== "firestore" && reloadUsers && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              void reloadUsers();
                            }}
                          >
                            Refresh
                          </Button>
                        )}
                      </p>
                    </div>
                  </div>

                  <Card className="rounded-2xl border-0 bg-white shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Member Since</TableHead>
                          <TableHead>Flights</TableHead>
                          <TableHead>Loyalty Points</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <div className="text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {user.id}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.role === "Admin"
                                    ? "bg-purple-100 text-purple-700 border-0"
                                    : "bg-blue-100 text-blue-700 border-0"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {user.memberSince}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {user.totalFlights}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {user.loyaltyPoints.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleToggleUserRole(user.id, user.role)
                                  }
                                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                >
                                  {user.role === "Admin" ? "Demote" : "Promote"}
                                </Button>
                                {user.role !== "Admin" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleToggleUserStatus(
                                          user.id,
                                          user.status
                                        )
                                      }
                                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    >
                                      {user.status === "Active"
                                        ? "Suspend"
                                        : "Activate"}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setUserToDelete(user.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </motion.div>
              )}

              {/* Reports View */}
              {currentView === "reports" && (
                <motion.div
                  key="reports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mb-6">
                    <h2 className="text-gray-900 mb-2">Reports & Analytics</h2>
                    <p className="text-gray-500">
                      Comprehensive system analytics and insights
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                          +12%
                        </Badge>
                      </div>
                      <div className="text-gray-600 mb-1">Average Rating</div>
                      <div className="text-gray-900 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        {stats.averageRating.toFixed(1)}
                      </div>
                    </Card>

                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                          +8%
                        </Badge>
                      </div>
                      <div className="text-gray-600 mb-1">Occupancy Rate</div>
                      <div className="text-gray-900">
                        {Math.round(
                          (flights.reduce((sum, f) => sum + f.booked, 0) /
                            flights.reduce((sum, f) => sum + f.capacity, 0)) *
                            100
                        )}
                        %
                      </div>
                    </Card>

                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">
                          +15%
                        </Badge>
                      </div>
                      <div className="text-gray-600 mb-1">
                        Avg. Booking Value
                      </div>
                      <div className="text-gray-900">
                        $
                        {Math.round(
                          stats.totalRevenue /
                            flights.reduce((sum, f) => sum + f.booked, 0)
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Detailed Reports */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-orange-500" />
                        Flight Status Distribution
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            status: "Active",
                            count: flights.filter((f) => f.status === "Active")
                              .length,
                            color: "bg-green-500",
                          },
                          {
                            status: "Scheduled",
                            count: flights.filter(
                              (f) => f.status === "Scheduled"
                            ).length,
                            color: "bg-blue-500",
                          },
                          {
                            status: "Delayed",
                            count: flights.filter((f) => f.status === "Delayed")
                              .length,
                            color: "bg-amber-500",
                          },
                          {
                            status: "Cancelled",
                            count: flights.filter(
                              (f) => f.status === "Cancelled"
                            ).length,
                            color: "bg-red-500",
                          },
                        ].map((item) => (
                          <div key={item.status}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">
                                {item.status}
                              </span>
                              <span className="text-gray-900">
                                {item.count} flights
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full`}
                                style={{
                                  width: `${
                                    (item.count / flights.length) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-500" />
                        User Activity
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            status: "Active Users",
                            count: users.filter((u) => u.status === "Active")
                              .length,
                            color: "bg-green-500",
                          },
                          {
                            status: "Inactive Users",
                            count: users.filter((u) => u.status === "Inactive")
                              .length,
                            color: "bg-gray-500",
                          },
                          {
                            status: "Suspended Users",
                            count: users.filter((u) => u.status === "Suspended")
                              .length,
                            color: "bg-red-500",
                          },
                        ].map((item) => (
                          <div key={item.status}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-600">
                                {item.status}
                              </span>
                              <span className="text-gray-900">
                                {item.count}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full`}
                                style={{
                                  width: `${
                                    (item.count / users.length) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      Export Full Report
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Settings View */}
              {currentView === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="mb-6">
                    <h2 className="text-gray-900 mb-2">System Settings</h2>
                    <p className="text-gray-500">
                      Configure system preferences and settings
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <h3 className="text-gray-900 mb-4">General Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>System Name</Label>
                          <Input
                            defaultValue="SkyWings Airlines"
                            className="mt-2 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Admin Email</Label>
                          <Input
                            defaultValue="admin@skywings.com"
                            className="mt-2 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label>Time Zone</Label>
                          <Select defaultValue="utc">
                            <SelectTrigger className="mt-2 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                              <SelectItem value="est">EST (GMT-5)</SelectItem>
                              <SelectItem value="pst">PST (GMT-8)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 rounded-2xl border-0 bg-white">
                      <h3 className="text-gray-900 mb-4">
                        Notification Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-900">
                              Email Notifications
                            </div>
                            <p className="text-sm text-gray-500">
                              Receive email alerts for important events
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-gray-900">Flight Alerts</div>
                            <p className="text-sm text-gray-500">
                              Get notified about flight status changes
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    </Card>

                    <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white rounded-xl">
                      Save Settings
                    </Button>
                  </div>
                </motion.div>
              )}
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

      {/* Flight Dialog */}
      <Dialog open={flightDialogOpen} onOpenChange={setFlightDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFlight ? "Edit Flight" : "Add New Flight"}
            </DialogTitle>
            <DialogDescription>
              {editingFlight
                ? "Update flight information"
                : "Add a new flight to the system"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Airline</Label>
              <Input
                value={flightForm.airline}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, airline: e.target.value })
                }
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Flight Number</Label>
              <Input
                value={flightForm.flightNumber}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, flightNumber: e.target.value })
                }
                placeholder="SW-XXX"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>From</Label>
              <Input
                value={flightForm.from}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, from: e.target.value })
                }
                placeholder="City (CODE)"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>To</Label>
              <Input
                value={flightForm.to}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, to: e.target.value })
                }
                placeholder="City (CODE)"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Departure Time</Label>
              <Input
                value={flightForm.departure}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, departure: e.target.value })
                }
                placeholder="10:30 AM"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Arrival Time</Label>
              <Input
                value={flightForm.arrival}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, arrival: e.target.value })
                }
                placeholder="10:45 PM"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                value={flightForm.duration}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, duration: e.target.value })
                }
                placeholder="7h 15m"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                value={flightForm.date}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, date: e.target.value })
                }
                placeholder="Oct 25, 2025"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Price ($)</Label>
              <Input
                type="number"
                value={flightForm.price}
                onChange={(e) =>
                  setFlightForm({
                    ...flightForm,
                    price: parseFloat(e.target.value),
                  })
                }
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Class</Label>
              <Select
                value={flightForm.class}
                onValueChange={(value: string) =>
                  setFlightForm({ ...flightForm, class: value })
                }
              >
                <SelectTrigger className="mt-2 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Aircraft</Label>
              <Input
                value={flightForm.aircraft}
                onChange={(e) =>
                  setFlightForm({ ...flightForm, aircraft: e.target.value })
                }
                placeholder="Boeing 787"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={flightForm.capacity}
                onChange={(e) =>
                  setFlightForm({
                    ...flightForm,
                    capacity: parseInt(e.target.value),
                  })
                }
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Rating</Label>
              <Input
                type="number"
                step="0.1"
                value={flightForm.rating}
                onChange={(e) =>
                  setFlightForm({
                    ...flightForm,
                    rating: parseFloat(e.target.value),
                  })
                }
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Booked</Label>
              <Input
                type="number"
                value={flightForm.booked}
                onChange={(e) =>
                  setFlightForm({
                    ...flightForm,
                    booked: parseInt(e.target.value),
                  })
                }
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={flightForm.status}
                onValueChange={(value: Flight["status"]) =>
                  setFlightForm({ ...flightForm, status: value })
                }
              >
                <SelectTrigger className="mt-2 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stops</Label>
              <Select
                value={flightForm.stops}
                onValueChange={(value: string) =>
                  setFlightForm({ ...flightForm, stops: value })
                }
              >
                <SelectTrigger className="mt-2 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-stop">Non-stop</SelectItem>
                  <SelectItem value="1 Stop">1 Stop</SelectItem>
                  <SelectItem value="2+ Stops">2+ Stops</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFlightDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveFlight}
              className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white"
            >
              {editingFlight ? "Update Flight" : "Add Flight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Flight Confirmation */}
      <AlertDialog
        open={flightToDelete !== null}
        onOpenChange={() => setFlightToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Flight?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this flight? This action cannot be
              undone and all associated bookings will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFlight}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Flight
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Confirmation */}
      <AlertDialog
        open={userToDelete !== null}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this user from the system? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
