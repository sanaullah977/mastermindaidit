import React, { useState, useEffect } from "react";
import { Key, X } from "lucide-react";
import { User } from "@/types/platform";
import { DBService } from "@/services/db";

interface ResetPasswordModalProps {
  user: User | null;
  currentUser: User | null;
  onClose: () => void;
  onPasswordReset: () => void;
  onToast: (msg: string) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  user,
  currentUser,
  onClose,
  onPasswordReset,
  onToast,
}) => {
  const [newPasswordForUser, setNewPasswordForUser] = useState("");
  const [showResetPassVisibility, setShowResetPassVisibility] = useState(false);

  useEffect(() => {
    setNewPasswordForUser("");
    setShowResetPassVisibility(false);
  }, [user]);

  if (!user) return null;

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newPasswordForUser || newPasswordForUser.length < 6) {
      onToast("New password must be at least 6 characters long.");
      return;
    }
    const res = DBService.adminResetUserPassword(
      user.id,
      newPasswordForUser,
      currentUser?.name || "Admin",
    );
    if (res.success) {
      onToast(`Password successfully reset for "${user.name}"!`);
      setNewPasswordForUser("");
      onPasswordReset();
      onClose();
    } else {
      onToast(res.error || "Failed to reset password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A192F] w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Direct Password Reset
              </h3>
              <p className="text-[11px] text-slate-400">
                For user: {user.name}
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

        <div className="p-3 bg-[#071325] rounded-xl border border-slate-800 flex items-center gap-3">
          <img
            src={
              user.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            }
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-xs font-bold text-white">{user.name}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              {user.email}
            </div>
            <div className="text-[10px] text-purple-400 font-bold uppercase">
              {user.role}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleResetPasswordSubmit}
          className="space-y-4 text-xs font-bold"
        >
          <div>
            <label className="block text-slate-300 mb-1">
              New User Password (minimum 6 characters)
            </label>
            <div className="relative">
              <input
                type={showResetPassVisibility ? "text" : "password"}
                required
                minLength={6}
                placeholder="Enter new password"
                value={newPasswordForUser}
                onChange={(e) => setNewPasswordForUser(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShowResetPassVisibility(!showResetPassVisibility)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
              >
                {showResetPassVisibility ? "Hide" : "Show"}
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
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold shadow-lg transition cursor-pointer"
            >
              Confirm Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
