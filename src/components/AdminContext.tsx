import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    setDoc,
} from "firebase/firestore";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import app from "../firebase";
import { useAuth } from "./AuthProvider";

export interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  date: string;
  price: number;
  class: string;
  stops: string;
  rating: number;
  status: "Active" | "Delayed" | "Cancelled" | "Scheduled";
  aircraft: string;
  capacity: number;
  booked: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
  memberSince: string;
  totalFlights: number;
  loyaltyPoints: number;
  status: "Active" | "Suspended" | "Inactive";
  lastLogin: string;
}

export interface SystemStats {
  totalFlights: number;
  totalUsers: number;
  activeFlights: number;
  totalRevenue: number;
  onTimeRate: number;
  averageRating: number;
}

interface AdminContextType {
  flights: Flight[];
  users: User[];
  usersSource?: "firestore" | "local";
  reloadUsers?: () => Promise<void>;
  addFlight: (flight: Omit<Flight, "id">) => void;
  updateFlight: (id: number, flight: Partial<Flight>) => void;
  deleteFlight: (id: number) => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getSystemStats: () => SystemStats;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const initialFlights: Flight[] = [
  {
    id: 1,
    airline: "SkyWings Airways",
    flightNumber: "SW-101",
    from: "New York (JFK)",
    to: "London (LHR)",
    departure: "10:30 AM",
    arrival: "10:45 PM",
    duration: "7h 15m",
    date: "Oct 25, 2025",
    price: 650,
    class: "Economy",
    stops: "Non-stop",
    rating: 4.8,
    status: "Active",
    aircraft: "Boeing 787",
    capacity: 242,
    booked: 189,
  },
  {
    id: 2,
    airline: "SkyWings Premium",
    flightNumber: "SW-205",
    from: "Los Angeles (LAX)",
    to: "Tokyo (NRT)",
    departure: "2:45 PM",
    arrival: "6:30 PM +1",
    duration: "11h 45m",
    date: "Oct 26, 2025",
    price: 1200,
    class: "Business",
    stops: "Non-stop",
    rating: 4.9,
    status: "Active",
    aircraft: "Airbus A350",
    capacity: 298,
    booked: 245,
  },
  {
    id: 3,
    airline: "SkyWings Express",
    flightNumber: "SW-312",
    from: "Dubai (DXB)",
    to: "Singapore (SIN)",
    departure: "8:15 AM",
    arrival: "6:00 PM",
    duration: "6h 45m",
    date: "Oct 27, 2025",
    price: 480,
    class: "Economy",
    stops: "Non-stop",
    rating: 4.7,
    status: "Active",
    aircraft: "Boeing 777",
    capacity: 368,
    booked: 302,
  },
  {
    id: 4,
    airline: "SkyWings Connect",
    flightNumber: "SW-428",
    from: "Paris (CDG)",
    to: "Sydney (SYD)",
    departure: "11:00 AM",
    arrival: "9:30 AM +1",
    duration: "19h 30m",
    date: "Oct 28, 2025",
    price: 890,
    class: "Economy",
    stops: "1 Stop",
    rating: 4.6,
    status: "Delayed",
    aircraft: "Airbus A380",
    capacity: 525,
    booked: 412,
  },
  {
    id: 5,
    airline: "SkyWings First",
    flightNumber: "SW-599",
    from: "Miami (MIA)",
    to: "Barcelona (BCN)",
    departure: "5:20 PM",
    arrival: "7:15 AM +1",
    duration: "8h 55m",
    date: "Oct 29, 2025",
    price: 2100,
    class: "First Class",
    stops: "Non-stop",
    rating: 5.0,
    status: "Active",
    aircraft: "Boeing 787",
    capacity: 248,
    booked: 198,
  },
  {
    id: 6,
    airline: "SkyWings Regional",
    flightNumber: "SW-645",
    from: "Toronto (YYZ)",
    to: "Vancouver (YVR)",
    departure: "9:00 AM",
    arrival: "11:30 AM",
    duration: "4h 30m",
    date: "Oct 30, 2025",
    price: 320,
    class: "Economy",
    stops: "Non-stop",
    rating: 4.5,
    status: "Scheduled",
    aircraft: "Airbus A320",
    capacity: 186,
    booked: 124,
  },
];

const initialUsers: User[] = [
  {
    id: "USR-001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "User",
    memberSince: "Jan 2023",
    totalFlights: 24,
    loyaltyPoints: 3450,
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: "USR-002",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    role: "User",
    memberSince: "Mar 2023",
    totalFlights: 18,
    loyaltyPoints: 2890,
    status: "Active",
    lastLogin: "1 day ago",
  },
  {
    id: "USR-003",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "User",
    memberSince: "May 2023",
    totalFlights: 31,
    loyaltyPoints: 4720,
    status: "Active",
    lastLogin: "3 hours ago",
  },
  {
    id: "USR-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "User",
    memberSince: "Feb 2023",
    totalFlights: 42,
    loyaltyPoints: 6180,
    status: "Active",
    lastLogin: "5 days ago",
  },
  {
    id: "USR-005",
    name: "David Wilson",
    email: "david.wilson@example.com",
    role: "User",
    memberSince: "Jul 2023",
    totalFlights: 12,
    loyaltyPoints: 1560,
    status: "Active",
    lastLogin: "1 week ago",
  },
  {
    id: "USR-006",
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    role: "User",
    memberSince: "Apr 2023",
    totalFlights: 8,
    loyaltyPoints: 920,
    status: "Inactive",
    lastLogin: "2 weeks ago",
  },
  {
    id: "ADM-001",
    name: "Admin User",
    email: "admin@skywings.com",
    role: "Admin",
    memberSince: "Jan 2023",
    totalFlights: 0,
    loyaltyPoints: 0,
    status: "Active",
    lastLogin: "Just now",
  },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = "sw_flights_v1";
  const [flights, setFlights] = useState<Flight[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Flight[];
        return parsed;
      }
    } catch (err) {
      // ignore parse errors and fall back to initial
    }
    return initialFlights;
  });
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { setRoleForEmail } = useAuth();

  // Firestore may not be available in every environment (e.g. no SDK included,
  // disabled in CI). Guard getFirestore so the app doesn't crash if it's
  // missing — fall back to local in-memory users.
  let db: any = null;
  let usersCollection: any = null;
  try {
    db = getFirestore(app);
    usersCollection = collection(db, "users");
  } catch (err) {
    // Firestore unavailable — we'll operate on local state only
    db = null;
    usersCollection = null;
  }

  const [usersSource, setUsersSource] = useState<"firestore" | "local">(
    usersCollection ? "firestore" : "local"
  );

  const reloadUsers = async () => {
    if (!usersCollection) {
      setUsersSource("local");
      return;
    }
    try {
      const snap = await getDocs(usersCollection);
      const fetched = snap.docs.map((d) => d.data() as User);
      setUsers(fetched);
      setUsersSource("firestore");
    } catch (err) {
      // permission denied or other Firestore error — keep local users but mark source
      // as local to reflect that Firestore isn't providing data here.
      setUsersSource("local");
      // Leave existing users untouched so admin still has a usable list.
      // Log the error for debugging.
      // eslint-disable-next-line no-console
      console.error("Failed to load users from Firestore:", err);
    }
  };

  // Load users once on mount (best-effort)
  useEffect(() => {
    void reloadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersCollection]);

  const addFlight = (flight: Omit<Flight, "id">) => {
    setFlights((prev) => {
      const maxId = prev.length ? Math.max(...prev.map((f) => f.id)) : 0;
      const newId = maxId + 1;
      const newFlight: Flight = { ...flight, id: newId } as Flight;
      // prepend so newly added flights appear at the top in admin and user lists
      return [newFlight, ...prev];
    });
  };

  const updateFlight = (id: number, updatedFlight: Partial<Flight>) => {
    setFlights((prev) =>
      prev.map((flight) =>
        flight.id === id ? { ...flight, ...updatedFlight } : flight
      )
    );
  };

  const deleteFlight = (id: number) => {
    setFlights((prev) => prev.filter((flight) => flight.id !== id));
  };

  const addUser = (user: Omit<User, "id">) => {
    setUsers((prev) => {
      const userCount = prev.filter((u) => u.role === "User").length;
      const newId = `USR-${String(userCount + 1).padStart(3, "0")}`;
      const newUser: User = { ...user, id: newId } as User;
      // persist to Firestore (best-effort)
      (async () => {
        try {
          await setDoc(doc(usersCollection, newId), newUser);
          // also persist role mapping for AuthProvider
          try {
            setRoleForEmail(newUser.email, newUser.role);
          } catch (e) {
            // ignore
          }
        } catch (err) {
          // ignore Firestore write errors
        }
      })();
      return [...prev, newUser];
    });
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers((prev) => {
      const next = prev.map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user
      );
      const updated = next.find((u) => u.id === id);
      if (updated) {
        (async () => {
          try {
            await setDoc(doc(usersCollection, id), updated);
            // if role changed, sync to AuthProvider persisted map
            if (updated.email && updated.role) {
              try {
                setRoleForEmail(updated.email, updated.role);
              } catch (e) {
                // ignore
              }
            }
          } catch (err) {
            // ignore
          }
        })();
      }
      return next;
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => {
      const removed = prev.find((u) => u.id === id);
      (async () => {
        try {
          await deleteDoc(doc(usersCollection, id));
          if (removed) {
            try {
              // clear role mapping for deleted user (best-effort)
              setRoleForEmail(removed.email, "User");
            } catch (e) {
              // ignore
            }
          }
        } catch (err) {
          // ignore
        }
      })();
      return prev.filter((user) => user.id !== id);
    });
  };

  // persist flights to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
    } catch (err) {
      // ignore
    }
  }, [flights]);

  const getSystemStats = () => {
    const totalRevenue = flights.reduce(
      (sum, flight) => sum + flight.price * flight.booked,
      0
    );
    const activeFlights = flights.filter(
      (f) => f.status === "Active" || f.status === "Scheduled"
    ).length;
    const onTimeFlights = flights.filter(
      (f) => f.status === "Active" || f.status === "Scheduled"
    ).length;
    const onTimeRate = (onTimeFlights / flights.length) * 100;
    const averageRating =
      flights.reduce((sum, f) => sum + f.rating, 0) / flights.length;

    return {
      totalFlights: flights.length,
      totalUsers: users.filter((u) => u.role === "User").length,
      activeFlights,
      totalRevenue,
      onTimeRate,
      averageRating,
    };
  };

  return (
    <AdminContext.Provider
      value={{
        flights,
        users,
        usersSource,
        reloadUsers,
        addFlight,
        updateFlight,
        deleteFlight,
        addUser,
        updateUser,
        deleteUser,
        getSystemStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
