import {
  FileText,
  LayoutDashboard,
  LogOut,
  Plane,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

type View = "dashboard" | "flights" | "users" | "reports" | "settings";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentView: View;
  setCurrentView: (view: View) => void;
  setSearchQuery: (query: string) => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  currentView,
  setCurrentView,
  setSearchQuery,
}: SidebarProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", value: "dashboard" as View },
    { icon: Plane, label: "Manage Flights", value: "flights" as View },
    { icon: Users, label: "User Management", value: "users" as View },
    { icon: FileText, label: "Reports", value: "reports" as View },
    { icon: Settings, label: "Settings", value: "settings" as View },
  ];

  return (
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
            onClick={async () => {
              try {
                await signOut();
              } catch (e) {
                // fallback: just navigate
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
  );
}
