import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Booking {
  id: string;
  flightNumber: string;
  airline: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  date: string;
  time: string;
  arrival: string;
  duration: string;
  passenger: string;
  seat: string;
  class: string;
  price: number;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  bookingDate: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "bookingDate">) => void;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
  getCancelledBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBookings: Booking[] = [
  {
    id: "BK-2451",
    flightNumber: "SW-101",
    airline: "SkyWings Airways",
    from: "New York",
    fromCode: "JFK",
    to: "London",
    toCode: "LHR",
    date: "2025-10-25",
    time: "10:30 AM",
    arrival: "10:45 PM",
    duration: "7h 15m",
    status: "Confirmed",
    seat: "12A",
    class: "Business",
    price: 1200,
    passenger: "John Smith",
    bookingDate: "2025-10-10",
  },
  {
    id: "BK-2458",
    flightNumber: "SW-205",
    airline: "SkyWings Premium",
    from: "Los Angeles",
    fromCode: "LAX",
    to: "Tokyo",
    toCode: "NRT",
    date: "2025-11-02",
    time: "2:45 PM",
    arrival: "6:30 PM +1",
    duration: "11h 45m",
    status: "Confirmed",
    seat: "8C",
    class: "Economy",
    price: 650,
    passenger: "John Smith",
    bookingDate: "2025-10-12",
  },
  {
    id: "BK-2387",
    flightNumber: "SW-445",
    airline: "SkyWings International",
    from: "Paris",
    fromCode: "CDG",
    to: "New York",
    toCode: "JFK",
    date: "2025-09-15",
    time: "11:00 AM",
    arrival: "1:30 PM",
    duration: "8h 30m",
    status: "Completed",
    seat: "5B",
    class: "Business",
    price: 850,
    passenger: "John Smith",
    bookingDate: "2025-09-01",
  },
  {
    id: "BK-2312",
    flightNumber: "SW-312",
    airline: "SkyWings Express",
    from: "Dubai",
    fromCode: "DXB",
    to: "Singapore",
    toCode: "SIN",
    date: "2025-08-20",
    time: "8:15 AM",
    arrival: "6:00 PM",
    duration: "6h 45m",
    status: "Completed",
    seat: "15F",
    class: "Economy",
    price: 620,
    passenger: "John Smith",
    bookingDate: "2025-08-05",
  },
  {
    id: "BK-2256",
    flightNumber: "SW-428",
    airline: "SkyWings Connect",
    from: "London",
    fromCode: "LHR",
    to: "Sydney",
    toCode: "SYD",
    date: "2025-07-10",
    time: "11:00 AM",
    arrival: "9:30 AM +1",
    duration: "19h 30m",
    status: "Completed",
    seat: "22D",
    class: "Economy",
    price: 1250,
    passenger: "John Smith",
    bookingDate: "2025-06-25",
  },
];

export function BookingProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = "sw_bookings_v1";
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Booking[];
    } catch (err) {
      // ignore parse errors
    }
    return initialBookings;
  });

  const addBooking = (booking: Omit<Booking, "id" | "bookingDate">) => {
    // normalize date string to ISO YYYY-MM-DD when possible so comparisons work
    let normalizedDate = booking.date;
    try {
      const parsed = Date.parse(booking.date);
      if (!isNaN(parsed)) {
        normalizedDate = new Date(parsed).toISOString().split("T")[0];
      }
    } catch (err) {
      // leave as-is
    }

    const newBooking: Booking = {
      ...booking,
      date: normalizedDate,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "Confirmed",
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "Cancelled" } : booking
      )
    );
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  // persist bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (err) {
      // ignore
    }
  }, [bookings]);

  const toDateOnly = (d: string) => {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) {
      // try parse common formats like 'Oct 15, 2025'
      const alt = Date.parse(d);
      if (!isNaN(alt)) return new Date(alt).setHours(0, 0, 0, 0);
      return new Date(0).setHours(0, 0, 0, 0);
    }
    const dt = new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate()
    );
    return dt.getTime();
  };

  const todayDateOnly = () => {
    const now = new Date();
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return dt.getTime();
  };

  const getUpcomingBookings = () => {
    const today = todayDateOnly();
    return bookings.filter((b) => {
      const bd = toDateOnly(b.date);
      return (
        (b.status === "Confirmed" || b.status === "Pending") && bd >= today
      );
    });
  };

  const getPastBookings = () => {
    const today = todayDateOnly();
    return bookings.filter((b) => {
      const bd = toDateOnly(b.date);
      return (
        b.status === "Completed" || (b.status === "Confirmed" && bd < today)
      );
    });
  };

  const getCancelledBookings = () => {
    return bookings.filter((b) => b.status === "Cancelled");
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        getUpcomingBookings,
        getPastBookings,
        getCancelledBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
}
