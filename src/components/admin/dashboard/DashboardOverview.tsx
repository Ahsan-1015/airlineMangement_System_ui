import {
    Clock,
    DollarSign,
    Plane,
    Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Flight, SystemStats, User } from "../../AdminContext";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface DashboardOverviewProps {
  stats: SystemStats;
  flights: Flight[];
  users: User[];
  setCurrentView: (view: "dashboard" | "flights" | "users" | "reports" | "settings") => void;
  getStatusColor: (status: string) => string;
}

export function DashboardOverview({
  stats,
  flights,
  users,
  setCurrentView,
  getStatusColor,
}: DashboardOverviewProps) {
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

  return (
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
                  <p className="text-gray-500">Latest flight operations</p>
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
                    <Badge className={getStatusColor(flight.status)}>
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
                  <p className="text-gray-500">Recent user activity</p>
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
                          <div className="text-gray-900">{user.name}</div>
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
  );
}
