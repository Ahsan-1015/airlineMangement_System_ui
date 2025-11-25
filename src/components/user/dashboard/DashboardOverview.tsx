import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Plane,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface DashboardOverviewProps {
  upcomingFlights: any[];
  recentBookings: any[];
  totalFlights: number;
  loyaltyPoints: number;
  setSelectedBooking: (booking: any) => void;
  setCurrentView: (view: "dashboard" | "flights" | "bookings" | "profile") => void;
}

export function DashboardOverview({
  upcomingFlights,
  recentBookings,
  totalFlights,
  loyaltyPoints,
  setSelectedBooking,
  setCurrentView,
}: DashboardOverviewProps) {
  const navigate = useNavigate();

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
                <p className="text-gray-500">Your confirmed bookings</p>
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
                      <div className="text-sm text-gray-600">Flight</div>
                      <div className="text-gray-900">{flight.flightNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">{flight.from}</div>
                      <div className="text-sm text-gray-500">{flight.fromCode}</div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-violet-600">
                        <div className="h-px w-16 bg-violet-300"></div>
                        <Plane className="w-5 h-5" />
                        <div className="h-px w-16 bg-violet-300"></div>
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-gray-900 mb-1">{flight.to}</div>
                      <div className="text-sm text-gray-500">{flight.toCode}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-violet-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{flight.date}</span>
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
                        <div className="text-sm text-gray-500">{booking.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900 mb-1">${booking.price}</div>
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
              <div className="text-sm text-violet-100 mb-2">Current Points</div>
              <div className="text-3xl mb-4">{loyaltyPoints.toLocaleString()} pts</div>
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
  );
}
