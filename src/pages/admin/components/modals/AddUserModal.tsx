import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { User, UserRole } from "@/types/platform";
import { DBService } from "@/services/db";

interface AddUserModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onUserCreated: () => void;
  onToast: (msg: string) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUserCreated,
  onToast,
}) => {
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("STUDENT");
  const [newUserStatus, setNewUserStatus] = useState<"ACTIVE" | "SUSPENDED">(
    "ACTIVE",
  );
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserBio, setNewUserBio] = useState("");

  if (!isOpen) return null;

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      onToast("User name is required.");
      return;
    }
    if (!newUserEmail.trim()) {
      onToast("Email address is required.");
      return;
    }
    const res = DBService.adminCreateUser(
      {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        phone: newUserPhone.trim(),
        role: newUserRole,
        status: newUserStatus,
        password: newUserPassword.trim() || "password123",
        bio: newUserBio.trim(),
      },
      currentUser?.name || "Admin",
    );

    if (res.success && res.user) {
      onToast(`New ${res.user.role} "${res.user.name}" created successfully!`);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPhone("");
      setNewUserPassword("");
      setNewUserBio("");
      setNewUserRole("STUDENT");
      setNewUserStatus("ACTIVE");
      onUserCreated();
      onClose();
    } else {
      onToast(res.error || "Failed to create user.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A192F] w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Create New Platform User
              </h3>
              <p className="text-[11px] text-slate-400">
                Add a student, teacher, or administrative account directly.
              </p>
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
          onSubmit={handleCreateNewUser}
          className="space-y-4 text-xs font-bold"
        >
          <div>
            <label className="block text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shakil Ahmed"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="user@mastermindaidit.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+880 1..."
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1">
                Role Assignment *
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TEACHER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1">
                Initial Password * (min 6 chars)
              </label>
              <input
                type="password"
                placeholder="e.g. password123"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">
              Bio / Role Notes
            </label>
            <textarea
              rows={2}
              placeholder="Optional brief notes..."
              value={newUserBio}
              onChange={(e) => setNewUserBio(e.target.value)}
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
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl font-extrabold shadow-lg transition cursor-pointer"
            >
              Create User Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
