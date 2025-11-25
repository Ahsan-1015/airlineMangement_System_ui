import { motion } from "motion/react";
import { useMemo } from "react";
import { useAuth } from "../../AuthProvider";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface UserProfileProps {
  totalFlights: number;
  loyaltyPoints: number;
}

export function UserProfile({ totalFlights, loyaltyPoints }: UserProfileProps) {
  const { user } = useAuth();

  const initials = useMemo(() => {
    if (!user) return "G";
    const source = user.displayName ?? user.email ?? "";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "G";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "—";
    try {
      const d = new Date(user.createdAt);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return user.createdAt;
    }
  }, [user?.createdAt]);

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 bg-gray-100 flex items-center justify-center border-4 border-red shadow-lg ">
            {user?.photoURL ? (
              <img
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? user.email ?? ""}
                className="w-24 h-24 object-cover rounded-full border-4 border-red shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-3xl">
                {initials}
              </div>
            )}
          </div>
          <h2 className="text-gray-900 mb-2">
            {user?.displayName ?? user?.email ?? "Guest User"}
          </h2>
          <p className="text-gray-500">{user?.email ?? "Not available"}</p>
          <Badge className="mt-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
            Premium Member
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 mb-1">Member Since</p>
            <p className="text-gray-900">{memberSince}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 mb-1">Total Flights</p>
            <p className="text-gray-900">{totalFlights} flights</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 mb-1">Loyalty Points</p>
            <p className="text-gray-900">{loyaltyPoints.toLocaleString()} pts</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600 mb-1">Member Status</p>
            <p className="text-gray-900">Premium</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button className="flex-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 hover:from-violet-600 hover:via-purple-600 hover:to-fuchsia-600 text-white rounded-xl">
            Edit Profile
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl">
            Change Password
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
