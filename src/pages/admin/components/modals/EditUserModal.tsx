import React, { useState, useEffect } from "react";
import { Edit3, X } from "lucide-react";
import { User, UserRole } from "@/types/platform";
import { DBService } from "@/services/db";

interface EditUserModalProps {
  user: User | null;
  currentUser: User | null;
  onClose: () => void;
  onUserUpdated: () => void;
  onToast: (msg: string) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  currentUser,
  onClose,
  onUserUpdated,
  onToast,
}) => {
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserBio, setEditUserBio] = useState("");
  const [editUserRole, setEditUserRole] = useState<UserRole>("STUDENT");
  const [editUserStatus, setEditUserStatus] = useState<"ACTIVE" | "SUSPENDED">(
    "ACTIVE",
  );

  useEffect(() => {
    if (user) {
      setEditUserName(user.name);
      setEditUserEmail(user.email);
      setEditUserPhone(user.phone || "");
      setEditUserBio(user.bio || "");
      setEditUserRole(user.role);
      setEditUserStatus(user.status);
    }
  }, [user]);

  if (!user) return null;

  const isEditingSelf = Boolean(
    currentUser &&
    (user.id === currentUser.id ||
      (user.email &&
        currentUser.email &&
        user.email.toLowerCase() === currentUser.email.toLowerCase())),
  );

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserName.trim()) {
      onToast("User name cannot be empty.");
      return;
    }
    const cleanEmail = editUserEmail.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      onToast("Please provide a valid email address.");
      return;
    }

    const existing = DBService.getUserByEmail(cleanEmail);
    if (existing && existing.id !== user.id) {
      onToast("Another user already exists with this email address.");
      return;
    }

    if (isEditingSelf) {
      if (editUserRole !== "ADMIN") {
        onToast(
          "Security Restriction: You cannot demote your own active Admin account!",
        );
        return;
      }
      if (editUserStatus === "SUSPENDED") {
        onToast(
          "Security Restriction: You cannot suspend your own active Admin account!",
        );
        return;
      }
    }

    const updated = DBService.updateUser(user.id, {
      name: editUserName.trim(),
      email: cleanEmail,
      phone: editUserPhone.trim(),
      bio: editUserBio.trim(),
      role: editUserRole,
      status: editUserStatus,
    });

    if (updated) {
      DBService.logAdminAction(
        currentUser?.id || "usr-admin-1",
        currentUser?.name || "Admin",
        `Updated details for user ${updated.name}`,
        "User",
        updated.id,
      );
      onToast(`User details for "${updated.name}" updated successfully!`);
      onUserUpdated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A192F] w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Edit User Profile & Role
              </h3>
              <p className="text-[11px] text-slate-400">User ID: {user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSaveEditUser}
          className="space-y-4 text-xs font-bold"
        >
          <div>
            <label className="block text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={editUserEmail}
                onChange={(e) => setEditUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+880 1..."
                value={editUserPhone}
                onChange={(e) => setEditUserPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">System Role</label>
              <select
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                disabled={isEditingSelf}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TEACHER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">
                Account Status
              </label>
              <select
                value={editUserStatus}
                onChange={(e) => setEditUserStatus(e.target.value as any)}
                disabled={isEditingSelf}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">
              Bio / Profile Description
            </label>
            <textarea
              rows={3}
              placeholder="Optional brief user description..."
              value={editUserBio}
              onChange={(e) => setEditUserBio(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow-lg transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
