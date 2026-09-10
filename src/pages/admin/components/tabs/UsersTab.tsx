import React from "react";
import {
  Users,
  UserPlus,
  Search,
  X,
  Filter,
  Phone,
  Eye,
  Edit3,
  Key,
  Trash2,
} from "lucide-react";
import { User, UserRole } from "../../../../types/platform";

interface UsersTabProps {
  users: User[];
  currentUser: User | null;
  userSearch: string;
  setUserSearch: (search: string) => void;
  userRoleFilter: UserRole | "ALL";
  setUserRoleFilter: (role: UserRole | "ALL") => void;
  userStatusFilter: "ALL" | "ACTIVE" | "SUSPENDED";
  setUserStatusFilter: (status: "ALL" | "ACTIVE" | "SUSPENDED") => void;
  onOpenAddUser: () => void;
  onChangeRole: (targetUser: User, newRole: UserRole) => void;
  onViewUser: (user: User) => void;
  onOpenEditUser: (user: User) => void;
  onOpenResetPassword: (user: User) => void;
  onToggleSuspendUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  currentUser,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter,
  onOpenAddUser,
  onChangeRole,
  onViewUser,
  onOpenEditUser,
  onOpenResetPassword,
  onToggleSuspendUser,
  onDeleteUser,
}) => {
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !userSearch.trim() ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.phone && u.phone.includes(userSearch));
    const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
    const matchesStatus =
      userStatusFilter === "ALL" || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const studentCount = users.filter((u) => u.role === "STUDENT").length;
  const teacherCount = users.filter((u) => u.role === "TEACHER").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const suspendedCount = users.filter((u) => u.status === "SUSPENDED").length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A192F] p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Users & Roles Access Management</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage role permissions, credentials, account activation, and user
            details in real-time.
          </p>
        </div>
        <button
          onClick={onOpenAddUser}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg transition cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add New User</span>
        </button>
      </div>

      {/* User Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => {
            setUserRoleFilter("ALL");
            setUserStatusFilter("ALL");
          }}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            userRoleFilter === "ALL" && userStatusFilter === "ALL"
              ? "bg-purple-900/30 border-purple-500 shadow-md"
              : "bg-[#0A192F] border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Total Users
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {users.length}
          </div>
        </div>

        <div
          onClick={() => {
            setUserRoleFilter("STUDENT");
            setUserStatusFilter("ALL");
          }}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            userRoleFilter === "STUDENT"
              ? "bg-blue-900/30 border-blue-500 shadow-md"
              : "bg-[#0A192F] border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
            Students
          </div>
          <div className="text-2xl font-black text-blue-300 mt-1">
            {studentCount}
          </div>
        </div>

        <div
          onClick={() => {
            setUserRoleFilter("TEACHER");
            setUserStatusFilter("ALL");
          }}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            userRoleFilter === "TEACHER"
              ? "bg-emerald-900/30 border-emerald-500 shadow-md"
              : "bg-[#0A192F] border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
            Teachers
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">
            {teacherCount}
          </div>
        </div>

        <div
          onClick={() => {
            setUserRoleFilter("ADMIN");
            setUserStatusFilter("ALL");
          }}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            userRoleFilter === "ADMIN"
              ? "bg-purple-900/30 border-purple-500 shadow-md"
              : "bg-[#0A192F] border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">
            Admins
          </div>
          <div className="text-2xl font-black text-purple-300 mt-1">
            {adminCount}
          </div>
        </div>

        <div
          onClick={() => {
            setUserStatusFilter("SUSPENDED");
            setUserRoleFilter("ALL");
          }}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            userStatusFilter === "SUSPENDED"
              ? "bg-rose-900/30 border-rose-500 shadow-md"
              : "bg-[#0A192F] border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
            Suspended
          </div>
          <div className="text-2xl font-black text-rose-300 mt-1">
            {suspendedCount}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#0A192F] p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, or phone..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#071325] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
            {userSearch && (
              <button
                onClick={() => setUserSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-[#071325] border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Role:
              </span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value as any)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles ({users.length})</option>
                <option value="STUDENT">Student ({studentCount})</option>
                <option value="TEACHER">Teacher ({teacherCount})</option>
                <option value="ADMIN">Admin ({adminCount})</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#071325] border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Status:
              </span>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value as any)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">
                  Active ({users.length - suspendedCount})
                </option>
                <option value="SUSPENDED">Suspended ({suspendedCount})</option>
              </select>
            </div>

            {(userSearch ||
              userRoleFilter !== "ALL" ||
              userStatusFilter !== "ALL") && (
              <button
                onClick={() => {
                  setUserSearch("");
                  setUserRoleFilter("ALL");
                  setUserStatusFilter("ALL");
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
          <span>
            Showing {filteredUsers.length} of {users.length} users
          </span>
          {userSearch && (
            <span className="text-purple-400 font-medium">
              Filtering by keyword: "{userSearch}"
            </span>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">User Details</th>
                <th className="p-3.5">Email & Contact</th>
                <th className="p-3.5">Role Permission</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Registered</th>
                <th className="p-3.5 text-right">Management Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-slate-600" />
                      <div className="font-bold text-sm text-slate-300">
                        No users found
                      </div>
                      <p className="text-xs text-slate-500">
                        Try adjusting your search criteria or clearing filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = Boolean(
                    currentUser &&
                    (u.id === currentUser.id ||
                      (Boolean(u.email && currentUser.email) &&
                        u.email.toLowerCase() ===
                          currentUser.email.toLowerCase())),
                  );

                  return (
                    <tr key={u.id} className="hover:bg-[#0c1e38] transition">
                      {/* User Details */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={
                                u.avatar ||
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                              }
                              alt={u.name}
                              className={`w-9 h-9 rounded-full object-cover ring-2 ${
                                u.role === "ADMIN"
                                  ? "ring-purple-500"
                                  : u.role === "TEACHER"
                                    ? "ring-emerald-500"
                                    : "ring-blue-500"
                              }`}
                            />
                            {u.status === "ACTIVE" ? (
                              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0A192F] absolute bottom-0 right-0" />
                            ) : (
                              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-[#0A192F] absolute bottom-0 right-0" />
                            )}
                          </div>
                          <div>
                            <div className="font-extrabold text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrentAdmin && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-purple-500/30 text-purple-300 border border-purple-500/40">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Contact */}
                      <td className="p-3.5">
                        <div className="font-mono text-slate-200">
                          {u.email}
                        </div>
                        {u.phone ? (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{u.phone}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500">
                            No phone provided
                          </div>
                        )}
                      </td>

                      {/* Role Selector with Immediate Update */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={isCurrentAdmin}
                            onChange={(e) =>
                              onChangeRole(u, e.target.value as UserRole)
                            }
                            className={`bg-[#071325] border text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none transition cursor-pointer ${
                              u.role === "ADMIN"
                                ? "border-purple-500/60 text-purple-300 bg-purple-950/20"
                                : u.role === "TEACHER"
                                  ? "border-emerald-500/60 text-emerald-300 bg-emerald-950/20"
                                  : "border-blue-500/60 text-blue-300 bg-blue-950/20"
                            } ${isCurrentAdmin ? "opacity-70 cursor-not-allowed" : ""}`}
                            title={
                              isCurrentAdmin
                                ? "You cannot change your own admin role."
                                : "Change user role"
                            }
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="TEACHER">TEACHER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-400" : "bg-rose-400"}`}
                          />
                          {u.status}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="p-3.5 text-slate-400 text-[11px] font-medium">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => onViewUser(u)}
                            title="View User Information"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User Details */}
                          <button
                            onClick={() => onOpenEditUser(u)}
                            title="Edit User Details"
                            className="p-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => onOpenResetPassword(u)}
                            title="Reset User Password"
                            className="p-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg transition"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Activate Toggle */}
                          <button
                            onClick={() => onToggleSuspendUser(u)}
                            disabled={isCurrentAdmin}
                            title={
                              isCurrentAdmin
                                ? "Cannot suspend self"
                                : u.status === "ACTIVE"
                                  ? "Suspend User"
                                  : "Activate User"
                            }
                            className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                              isCurrentAdmin
                                ? "opacity-40 cursor-not-allowed border-slate-700 text-slate-500 bg-slate-800/40"
                                : u.status === "ACTIVE"
                                  ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/30"
                                  : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30"
                            }`}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>

                          {/* Delete User */}
                          <button
                            onClick={() => onDeleteUser(u)}
                            disabled={isCurrentAdmin}
                            title={
                              isCurrentAdmin
                                ? "Cannot delete self"
                                : "Permanently Delete User"
                            }
                            className={`p-1.5 rounded-lg border transition ${
                              isCurrentAdmin
                                ? "opacity-30 cursor-not-allowed border-slate-800 text-slate-600"
                                : "bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border-rose-800/40 hover:text-rose-200"
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
