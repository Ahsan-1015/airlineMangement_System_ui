import { ArrowLeft, Lock, Mail, Plane, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { auth } from "../firebase";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"user" | "admin">("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, googleSignIn, setRoleForEmail } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register(
        email,
        password,
        name,
        userType === "admin" ? "Admin" : "User"
      );
      toast.success("Account created successfully!");
      if (userType === "admin") navigate("/admin-dashboard");
      else navigate("/user-dashboard");
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/login")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Login</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="p-8 md:p-12 bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border-0">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Plane className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our airline management system</p>
          </motion.div>

          {/* User Type Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType("user")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "user"
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Plane className="w-5 h-5" />
                  <span className="text-sm">User Account</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === "admin"
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span className="text-sm">Admin Account</span>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleRegister}
            className="space-y-5"
          >
            {/* Name Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-400 bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-400 bg-white/50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-400 bg-white/50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-400 bg-white/50"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 ${
                userType === "admin"
                  ? "bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600"
                  : "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600"
              } text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
            >
              {isLoading
                ? "Creating Account..."
                : `Create ${userType === "admin" ? "Admin" : "User"} Account`}
            </Button>

            {/* Google Sign-in */}
            <div className="mt-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    await googleSignIn();
                    // persist role for this google account email
                    try {
                      const e = auth.currentUser?.email;
                      if (e)
                        setRoleForEmail(
                          e,
                          userType === "admin" ? "Admin" : "User"
                        );
                    } catch (err) {
                      // ignore
                    }
                    toast.success("Signed in with Google");
                    if (userType === "admin") navigate("/admin-dashboard");
                    else navigate("/user-dashboard");
                  } catch (err: any) {
                    console.error("Google sign-in error", err);
                    toast.error(err?.message || "Google sign-in failed");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 border border-violet-500 text-lg font-semibold rounded-xl py-3 hover:bg-violet-100"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            </div>
          </motion.form>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </Card>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl transform translate-x-4 translate-y-4"
        />
      </motion.div>
    </div>
  );
}
