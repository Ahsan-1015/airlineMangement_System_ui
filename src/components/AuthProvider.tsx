import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase";

type AppUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt?: string | null;
  lastSignIn?: string | null;
  role?: "User" | "Admin";
};

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string,
    role?: "User" | "Admin"
  ) => Promise<void>;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getRoleForEmail: (email?: string | null) => "User" | "Admin" | undefined;
  setRoleForEmail: (email: string, role: "User" | "Admin") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_KEY = "aws_roles";

function readRoleMap(): Record<string, "User" | "Admin"> {
  try {
    const raw = localStorage.getItem(ROLE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, "User" | "Admin">;
  } catch (err) {
    return {};
  }
}

function writeRoleMap(map: Record<string, "User" | "Admin">) {
  try {
    localStorage.setItem(ROLE_KEY, JSON.stringify(map));
  } catch (err) {
    // ignore
  }
}

function getRoleForEmail(email?: string | null): "User" | "Admin" | undefined {
  if (!email) return undefined;
  const map = readRoleMap();
  return map[email.toLowerCase()];
}

function setRoleForEmail(email: string, role: "User" | "Admin") {
  const map = readRoleMap();
  map[email.toLowerCase()] = role;
  writeRoleMap(map);
}

function mapUser(u: FirebaseUser | null): AppUser | null {
  if (!u) return null;
  const role = getRoleForEmail(u.email);
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    createdAt: u.metadata?.creationTime ?? null,
    lastSignIn: u.metadata?.lastSignInTime ?? null,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        setUser(mapUser(u));
        setLoading(false);
      },
      (err) => {
        // Useful to see errors during initialization (e.g. invalid API key)
        // eslint-disable-next-line no-console
        console.error("onAuthStateChanged error", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (
    email: string,
    password: string,
    displayName?: string,
    role: "User" | "Admin" = "User"
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("updateProfile failed", err);
      }
    }
    try {
      setRoleForEmail(email, role);
    } catch (err) {
      // ignore
    }
    // refresh local user state
    setUser(mapUser(auth.currentUser));
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        register,
        googleSignIn,
        signOut,
        getRoleForEmail,
        setRoleForEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
