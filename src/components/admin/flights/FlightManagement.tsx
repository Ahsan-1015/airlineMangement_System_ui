import {
    Edit,
    PlusCircle,
    Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Flight, useAdmin } from "../../AdminContext";
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
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface FlightManagementProps {
  filteredFlights: Flight[];
  getStatusColor: (status: string) => string;
}

export function FlightManagement({
  filteredFlights,
  getStatusColor,
}: FlightManagementProps) {
  const { addFlight, updateFlight, deleteFlight } = useAdmin();
  
  const [flightDialogOpen, setFlightDialogOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [flightToDelete, setFlightToDelete] = useState<number | null>(null);

  // Default flight form values
  const defaultFlightForm: Omit<Flight, "id"> = {
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
  };

  const [flightForm, setFlightForm] = useState<Omit<Flight, "id">>(defaultFlightForm);

  const handleAddFlight = () => {
    setEditingFlight(null);
    setFlightForm(defaultFlightForm);
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

  return (
    <>
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
                    <div className="text-gray-900">{flight.flightNumber}</div>
                    <div className="text-sm text-gray-500">{flight.airline}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-900">{flight.from}</div>
                    <div className="text-sm text-gray-500">→ {flight.to}</div>
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
                      {Math.round((flight.booked / flight.capacity) * 100)}% full
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">${flight.price}</TableCell>
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
    </>
  );
}
