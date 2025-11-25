import {
    Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdmin, User } from "../../AdminContext";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table";

interface UserManagementProps {
  filteredUsers: User[];
  usersSource: "firestore" | "local" | undefined;
  reloadUsers: (() => Promise<void>) | undefined;
  getStatusColor: (status: string) => string;
}

export function UserManagement({
  filteredUsers,
  usersSource,
  reloadUsers,
  getStatusColor,
}: UserManagementProps) {
  const { updateUser, deleteUser } = useAdmin();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      toast.success("User removed successfully");
      setUserToDelete(null);
    }
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
    updateUser(userId, { status: newStatus as "Active" | "Suspended" });
    toast.success(`User ${newStatus.toLowerCase()}`);
  };

  const handleToggleUserRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === "Admin" ? "User" : "Admin";
    updateUser(userId, { role: newRole as "User" | "Admin" });
    toast.success(`Role updated to ${newRole}`);
  };

  return (
    <>
      <motion.div
        key="users"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900">User Management</h2>
            <p className="text-gray-500 flex items-center gap-3">
              <span>
                Showing {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                Source: {usersSource === "firestore" ? "Firestore" : "Local"}
              </span>
              {usersSource !== "firestore" && reloadUsers && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    void reloadUsers();
                  }}
                >
                  Refresh
                </Button>
              )}
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border-0 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead>Flights</TableHead>
                <TableHead>Loyalty Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-900">{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-700 border-0"
                          : "bg-blue-100 text-blue-700 border-0"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {user.memberSince}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {user.totalFlights}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {user.loyaltyPoints.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleUserRole(user.id, user.role)}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        {user.role === "Admin" ? "Demote" : "Promote"}
                      </Button>
                      {user.role !== "Admin" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleToggleUserStatus(user.id, user.status)
                            }
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          >
                            {user.status === "Active" ? "Suspend" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setUserToDelete(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>

      {/* Delete User Confirmation */}
      <AlertDialog
        open={userToDelete !== null}
        onOpenChange={() => setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this user from the system? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
