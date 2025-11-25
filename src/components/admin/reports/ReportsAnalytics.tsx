import {
    Activity,
    BarChart3,
    Download,
    PieChart,
    TrendingUp,
    Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Flight, SystemStats, User } from "../../AdminContext";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface ReportsAnalyticsProps {
  stats: SystemStats;
  flights: Flight[];
  users: User[];
}

export function ReportsAnalytics({
  stats,
  flights,
  users,
}: ReportsAnalyticsProps) {
  return (
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
            {/* Note: Star icon was used here in original code but not imported in this snippet context if not needed, or add it to imports */}
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
          <div className="text-gray-600 mb-1">Avg. Booking Value</div>
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
                count: flights.filter((f) => f.status === "Active").length,
                color: "bg-green-500",
              },
              {
                status: "Scheduled",
                count: flights.filter((f) => f.status === "Scheduled").length,
                color: "bg-blue-500",
              },
              {
                status: "Delayed",
                count: flights.filter((f) => f.status === "Delayed").length,
                color: "bg-amber-500",
              },
              {
                status: "Cancelled",
                count: flights.filter((f) => f.status === "Cancelled").length,
                color: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">{item.status}</span>
                  <span className="text-gray-900">{item.count} flights</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{
                      width: `${(item.count / flights.length) * 100}%`,
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
                count: users.filter((u) => u.status === "Active").length,
                color: "bg-green-500",
              },
              {
                status: "Inactive Users",
                count: users.filter((u) => u.status === "Inactive").length,
                color: "bg-gray-500",
              },
              {
                status: "Suspended Users",
                count: users.filter((u) => u.status === "Suspended").length,
                color: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">{item.status}</span>
                  <span className="text-gray-900">{item.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{
                      width: `${(item.count / users.length) * 100}%`,
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
  );
}
