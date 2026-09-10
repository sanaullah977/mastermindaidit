import React from "react";
import { ShieldCheck, Key } from "lucide-react";
import { User } from "../../../../types/platform";

interface AdministratorsTabProps {
  users: User[];
  newAdminName: string;
  setNewAdminName: (name: string) => void;
  newAdminEmail: string;
  setNewAdminEmail: (email: string) => void;
  newTeacherAccessCode: string;
  setNewTeacherAccessCode: (code: string) => void;
  newAdminSecurityCode: string;
  setNewAdminSecurityCode: (code: string) => void;
  onCreateAdmin: (e: React.FormEvent) => void;
  onRotateAccessCodes: (e: React.FormEvent) => void;
}

export const AdministratorsTab: React.FC<AdministratorsTabProps> = ({
  users,
  newAdminName,
  setNewAdminName,
  newAdminEmail,
  setNewAdminEmail,
  newTeacherAccessCode,
  setNewTeacherAccessCode,
  newAdminSecurityCode,
  setNewAdminSecurityCode,
  onCreateAdmin,
  onRotateAccessCodes,
}) => {
  return (
    <div className="space-y-6">
      {/* Create Administrator Card */}
      <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-black flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span>Create Authorized Administrator Account</span>
        </h3>
        <p className="text-xs text-slate-400">
          Only existing authenticated Admins can provision another Administrator
          account.
        </p>

        <form
          onSubmit={onCreateAdmin}
          className="grid sm:grid-cols-3 gap-3 text-xs font-bold"
        >
          <input
            type="text"
            required
            placeholder="Admin Name"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
            className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
          />
          <input
            type="email"
            required
            placeholder="admin@mastermindaidit.com"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
          />
          <button
            type="submit"
            className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow"
          >
            + Create Administrator
          </button>
        </form>
      </div>

      {/* Access Code Rotation Card */}
      <div className="bg-[#0A192F] p-6 rounded-3xl border border-purple-500/30 space-y-4">
        <h3 className="text-lg font-black flex items-center gap-2 text-purple-300">
          <Key className="w-5 h-5 text-amber-400" />
          <span>Rotate System Security Access Codes</span>
        </h3>
        <p className="text-xs text-slate-400">
          Update server access codes for Teacher registration and Admin security
          login.
        </p>

        <form
          onSubmit={onRotateAccessCodes}
          className="grid sm:grid-cols-3 gap-3 text-xs font-bold"
        >
          <div>
            <label className="block text-[11px] text-emerald-400 mb-1">
              New Teacher Code (Default: MASTERMIND10)
            </label>
            <input
              type="text"
              placeholder="e.g. MASTERMIND2026"
              value={newTeacherAccessCode}
              onChange={(e) => setNewTeacherAccessCode(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] text-purple-400 mb-1">
              New Admin Code (Default: masudul)
            </label>
            <input
              type="password"
              placeholder="Enter new Admin security secret"
              value={newAdminSecurityCode}
              onChange={(e) => setNewAdminSecurityCode(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-extrabold shadow"
            >
              Rotate Security Codes
            </button>
          </div>
        </form>
      </div>

      {/* List of Admins */}
      <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-3">
        <h4 className="text-sm font-black text-white">
          Active Platform Administrators
        </h4>
        <div className="space-y-2">
          {users
            .filter((u) => u.role === "ADMIN")
            .map((adm) => (
              <div
                key={adm.id}
                className="p-3.5 bg-[#071325] rounded-2xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={adm.avatar}
                    alt={adm.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500"
                  />
                  <div>
                    <div className="font-extrabold text-white">{adm.name}</div>
                    <div className="text-[10px] text-purple-400 font-mono">
                      {adm.email}
                    </div>
                  </div>
                </div>
                <span className="bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                  SUPER ADMIN
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
