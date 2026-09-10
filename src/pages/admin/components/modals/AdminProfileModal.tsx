import React, { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";
import { User } from "@/types/platform";

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  updateProfile: (
    data: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; error?: string }>;
  onToast: (msg: string) => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  updateProfile,
  changePassword,
  onToast,
}) => {
  const [adminProfileName, setAdminProfileName] = useState(
    currentUser?.name || "",
  );
  const [adminProfilePhone, setAdminProfilePhone] = useState(
    currentUser?.phone || "",
  );
  const [adminProfileAvatar, setAdminProfileAvatar] = useState(
    currentUser?.avatar || "",
  );
  const [adminProfileBio, setAdminProfileBio] = useState(
    currentUser?.bio || "",
  );
  const [adminCurrentPassword, setAdminCurrentPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminShowOldPass, setAdminShowOldPass] = useState(false);
  const [adminShowNewPass, setAdminShowNewPass] = useState(false);
  const [adminShowConfirmPass, setAdminShowConfirmPass] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState<"profile" | "password">(
    "profile",
  );

  useEffect(() => {
    if (isOpen && currentUser) {
      setAdminProfileName(currentUser.name || "");
      setAdminProfilePhone(currentUser.phone || "");
      setAdminProfileAvatar(currentUser.avatar || "");
      setAdminProfileBio(currentUser.bio || "");
    }
    setAdminCurrentPassword("");
    setAdminNewPassword("");
    setAdminConfirmPassword("");
    setAdminModalTab("profile");
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfileName.trim()) {
      onToast("Admin name cannot be empty.");
      return;
    }
    const res = await updateProfile({
      name: adminProfileName.trim(),
      phone: adminProfilePhone.trim(),
      avatar: adminProfileAvatar.trim(),
      bio: adminProfileBio.trim(),
    });
    if (res.success) {
      onToast("Admin profile updated successfully!");
      onClose();
    } else {
      onToast(res.error || "Failed to update profile.");
    }
  };

  const handleSaveAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPassword || adminNewPassword.length < 6) {
      onToast("Password must be at least 6 characters.");
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      onToast("Passwords do not match.");
      return;
    }
    const res = await changePassword(adminCurrentPassword, adminNewPassword);
    if (res.success) {
      onToast("Admin password updated successfully!");
      setAdminCurrentPassword("");
      setAdminNewPassword("");
      setAdminConfirmPassword("");
      onClose();
    } else {
      onToast(res.error || "Failed to update password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1B33] border border-purple-500/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Admin Profile & Security
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage administrator account and reset password
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-[#071325] rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setAdminModalTab("profile")}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              adminModalTab === "profile"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Admin Profile Details
          </button>
          <button
            type="button"
            onClick={() => setAdminModalTab("password")}
            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
              adminModalTab === "password"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Reset / Change Password
          </button>
        </div>

        {/* Profile Tab */}
        {adminModalTab === "profile" && (
          <form
            onSubmit={handleSaveAdminProfile}
            className="space-y-4 text-xs font-bold"
          >
            <div>
              <label className="block text-slate-300 mb-1">
                Admin Display Name
              </label>
              <input
                type="text"
                required
                value={adminProfileName}
                onChange={(e) => setAdminProfileName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Admin Email (Readonly)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ""}
                className="w-full px-4 py-2.5 bg-[#071325]/50 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. +880 1712-949410"
                value={adminProfilePhone}
                onChange={(e) => setAdminProfilePhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Avatar Image URL
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  placeholder="Paste avatar URL"
                  value={adminProfileAvatar}
                  onChange={(e) => setAdminProfileAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                />
                <img
                  src={
                    adminProfileAvatar ||
                    currentUser?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  }
                  alt="Avatar Preview"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500 shrink-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Admin Bio</label>
              <textarea
                rows={2}
                value={adminProfileBio}
                onChange={(e) => setAdminProfileBio(e.target.value)}
                className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-normal"
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
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-extrabold shadow-lg transition cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {adminModalTab === "password" && (
          <form
            onSubmit={handleSaveAdminPassword}
            className="space-y-4 text-xs font-bold"
          >
            <div>
              <label className="block text-slate-300 mb-1">
                Current Password (if configured)
              </label>
              <div className="relative">
                <input
                  type={adminShowOldPass ? "text" : "password"}
                  placeholder="Enter current password"
                  value={adminCurrentPassword}
                  onChange={(e) => setAdminCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setAdminShowOldPass(!adminShowOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
                >
                  {adminShowOldPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={adminShowNewPass ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={adminNewPassword}
                  onChange={(e) => setAdminNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setAdminShowNewPass(!adminShowNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
                >
                  {adminShowNewPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={adminShowConfirmPass ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={adminConfirmPassword}
                  onChange={(e) => setAdminConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setAdminShowConfirmPass(!adminShowConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
                >
                  {adminShowConfirmPass ? "Hide" : "Show"}
                </button>
              </div>
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
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
