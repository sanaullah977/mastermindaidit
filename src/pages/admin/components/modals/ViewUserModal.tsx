import React from "react";
import { User as UserIcon, X } from "lucide-react";
import { User } from "@/types/platform";

interface ViewUserModalProps {
  user: User | null;
  onClose: () => void;
  onEditUser: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  user,
  onClose,
  onEditUser,
  onResetPassword,
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0A192F] w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                User Profile Details
              </h3>
              <p className="text-[11px] text-slate-400">
                Account overview and status
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

        <div className="flex items-center gap-4 p-4 bg-[#071325] rounded-2xl border border-slate-800">
          <img
            src={
              user.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            }
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40"
          />
          <div className="space-y-1">
            <div className="text-base font-extrabold text-white flex items-center gap-2">
              <span>{user.name}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  user.role === "ADMIN"
                    ? "bg-purple-500/20 text-purple-300"
                    : user.role === "TEACHER"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-blue-500/20 text-blue-300"
                }`}
              >
                {user.role}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">{user.email}</div>
            <div className="flex items-center gap-2 text-[10px]">
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase ${
                  user.status === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {user.status}
              </span>
              {user.phone && (
                <span className="text-slate-400">Phone: {user.phone}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#071325] rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Account ID
            </span>
            <span className="font-mono text-slate-300 text-[11px] break-all">
              {user.id}
            </span>
          </div>
          <div className="p-3 bg-[#071325] rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              Member Since
            </span>
            <span className="text-slate-300 text-[11px] font-bold">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        {user.bio && (
          <div className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              Biography
            </span>
            <p className="text-slate-300 leading-relaxed font-normal">
              {user.bio}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              const u = user;
              onClose();
              onEditUser(u);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition"
          >
            Edit User
          </button>
          <button
            onClick={() => {
              const u = user;
              onClose();
              onResetPassword(u);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
          >
            Reset Password
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
