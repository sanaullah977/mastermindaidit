import React from "react";
import {
  CreditCard,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
} from "lucide-react";
import { Transaction } from "../../../../types/platform";

interface TransactionsTabProps {
  trxList: Transaction[];
  pendingTrxCount: number;
  trxSearch: string;
  setTrxSearch: (search: string) => void;
  trxFilter: "ALL" | "PENDING" | "SUCCESS" | "FAILED";
  setTrxFilter: (filter: "ALL" | "PENDING" | "SUCCESS" | "FAILED") => void;
  onUpdateTrxStatus: (trxId: string, status: Transaction["status"]) => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  trxList,
  pendingTrxCount,
  trxSearch,
  setTrxSearch,
  trxFilter,
  setTrxFilter,
  onUpdateTrxStatus,
}) => {
  return (
    <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span>Course Enrollment Requests & Transactions Ledger</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Review student payment submissions, verify TrxID & mobile numbers,
            and approve course enrollments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">
            Total: {trxList.length}
          </span>
          {pendingTrxCount > 0 && (
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black animate-pulse">
              {pendingTrxCount} Pending Approval
            </span>
          )}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400">
            Total Requests
          </div>
          <div className="text-xl font-black text-white">{trxList.length}</div>
        </div>
        <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-amber-400">
            Pending Approvals
          </div>
          <div className="text-xl font-black text-amber-400">
            {pendingTrxCount}
          </div>
        </div>
        <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-emerald-400">
            Enrolled / Success
          </div>
          <div className="text-xl font-black text-emerald-400">
            {trxList.filter((t) => t.status === "SUCCESS").length}
          </div>
        </div>
        <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-purple-400">
            Collected Revenue
          </div>
          <div className="text-xl font-black text-purple-400">
            ৳
            {trxList
              .filter((t) => t.status === "SUCCESS")
              .reduce((sum, t) => sum + (t.amount || 0), 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, TrxID, course, email..."
            value={trxSearch}
            onChange={(e) => setTrxSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(["ALL", "PENDING", "SUCCESS", "FAILED"] as const).map((filter) => {
            const count =
              filter === "ALL"
                ? trxList.length
                : trxList.filter((t) => t.status === filter).length;
            return (
              <button
                key={filter}
                onClick={() => setTrxFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  trxFilter === filter
                    ? filter === "PENDING"
                      ? "bg-amber-500 text-slate-900 shadow-md font-black"
                      : "bg-purple-600 text-white shadow-md"
                    : "bg-[#071325] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <span>{filter}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transactions & Requests Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800 tracking-wider">
            <tr>
              <th className="p-3.5 px-4">TrxID & Date</th>
              <th className="p-3.5">Student Info</th>
              <th className="p-3.5">Course Requested</th>
              <th className="p-3.5">Amount & Gateway</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 px-4 text-right">Approval Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
            {trxList
              .filter((t) => {
                if (trxFilter !== "ALL" && t.status !== trxFilter) return false;
                if (trxSearch.trim()) {
                  const q = trxSearch.toLowerCase();
                  return (
                    t.transactionId.toLowerCase().includes(q) ||
                    t.courseTitle.toLowerCase().includes(q) ||
                    t.userName.toLowerCase().includes(q) ||
                    t.userEmail.toLowerCase().includes(q) ||
                    (t.accountNumber && t.accountNumber.includes(q))
                  );
                }
                return true;
              })
              .map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition">
                  <td className="p-3.5 px-4 font-mono">
                    <div className="font-black text-white text-xs">
                      {t.transactionId}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white text-xs">
                      {t.userName}
                    </div>
                    <div className="text-[10px] text-purple-400">
                      {t.userEmail}
                    </div>
                    {t.accountNumber && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        Ph: {t.accountNumber}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-100 max-w-xs line-clamp-2">
                      {t.courseTitle}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ID: {t.courseId}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-black text-emerald-400 text-xs">
                      ৳{t.amount.toLocaleString()} BDT
                    </div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {t.status === "PENDING" ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black px-2.5 py-1 rounded-full animate-pulse">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    ) : t.status === "SUCCESS" ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> APPROVED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
                        <XCircle className="w-3 h-3" /> REJECTED
                      </span>
                    )}
                    {t.approvedBy && (
                      <div className="text-[9px] text-slate-500 mt-1 font-mono">
                        by {t.approvedBy}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 px-4 text-right">
                    {t.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateTrxStatus(t.id, "SUCCESS")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition shadow flex items-center gap-1 cursor-pointer"
                          title="Approve payment & activate course enrollment for student"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateTrxStatus(t.id, "FAILED")}
                          className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Reject request"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : t.status === "FAILED" ? (
                      <button
                        type="button"
                        onClick={() => onUpdateTrxStatus(t.id, "SUCCESS")}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        Re-Approve
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            {trxList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No transactions recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
