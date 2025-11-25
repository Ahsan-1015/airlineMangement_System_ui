import { Calendar, Clock, Plane } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface MyFlightsProps {
  searchedBookings: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedBooking: (booking: any) => void;
}

export function MyFlights({
  searchedBookings,
  searchQuery,
  setSearchQuery,
  setSelectedBooking,
}: MyFlightsProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      key="flights"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">My Upcoming Flights</h2>
        <p className="text-gray-500">
          You have {searchedBookings.length} upcoming flight
          {searchedBookings.length !== 1 ? "s" : ""}
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
                          <p className="text-gray-600">ID: {booking.id}</p>
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
                        <div className="text-gray-900 mb-1">{booking.from}</div>
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
                        <div className="text-gray-900 mb-1">{booking.to}</div>
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
                      <div className="text-gray-900">${booking.price}</div>
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
  );
}
