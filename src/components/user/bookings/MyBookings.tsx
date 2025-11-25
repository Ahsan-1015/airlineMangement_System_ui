import { Calendar, Clock, Download, MapPin, Plane } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBookings } from "../../BookingContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

interface MyBookingsProps {
  searchedBookings: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function MyBookings({
  searchedBookings,
  searchQuery,
  setSearchQuery,
}: MyBookingsProps) {
  const navigate = useNavigate();
  const { cancelBooking } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const handleCancelBooking = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel);
      setBookingToCancel(null);
      setSelectedBooking(null);
    }
  };

  return (
    <>
      <motion.div
        key="bookings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">All My Bookings</h2>
          <p className="text-gray-500">
            Showing {searchedBookings.length} booking
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
                  Complete information about your flight booking
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                    <p className="text-gray-900">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge
                      className={
                        selectedBooking.status === "Confirmed"
                          ? "bg-green-100 text-green-700 border-0"
                          : "bg-amber-100 text-amber-700 border-0"
                      }
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Flight Number</p>
                    <p className="text-gray-900">{selectedBooking.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-gray-900">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">From</p>
                    <p className="text-gray-900">
                      {selectedBooking.from} ({selectedBooking.fromCode})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">To</p>
                    <p className="text-gray-900">
                      {selectedBooking.to} ({selectedBooking.toCode})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Departure</p>
                    <p className="text-gray-900">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Seat</p>
                    <p className="text-gray-900">{selectedBooking.seat}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Class</p>
                    <p className="text-gray-900">{selectedBooking.class}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <p className="text-gray-900 text-xl font-semibold">
                      ${selectedBooking.price}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    /* Download ticket logic */
                  }}
                  className="rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Ticket
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    /* View on map logic */
                  }}
                  className="rounded-xl"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
                {selectedBooking.status === "Confirmed" && (
                  <Button
                    variant="destructive"
                    onClick={() => setBookingToCancel(selectedBooking.id)}
                    className="rounded-xl"
                  >
                    Cancel Booking
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
              Are you sure you want to cancel this booking? This action cannot be
              undone and you may be subject to cancellation fees.
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
    </>
  );
}
