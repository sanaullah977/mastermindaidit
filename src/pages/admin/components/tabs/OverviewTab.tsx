import React from "react";
import { CreditCard, History } from "lucide-react";
import { AuditLog } from "../../../../types/platform";
import { AdminTab } from "../AdminSidebar";

interface OverviewTabProps {
  pendingTrxCount: number;
  setActiveTab: (tab: AdminTab) => void;
  stats: {
    totalRevenue: number;
    totalCourses: number;
    reportedComments: number;
    [key: string]: any;
  };
  auditLogs: AuditLog[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  pendingTrxCount,
  setActiveTab,
  stats,
  auditLogs,
}) => {
  return (
    <div className="space-y-8">
      {pendingTrxCount > 0 && (
        <div className="p-4 bg-amber-500/20 border border-amber-400/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-300">
                {pendingTrxCount} Course Enrollment Request(s) Awaiting
                Approval!
              </h4>
              <p className="text-xs text-slate-300">
                Students have submitted payments. Review and approve their
                requests to unlock their classroom.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("transactions")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow transition shrink-0 cursor-pointer"
          >
            Review Requests →
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Total Revenue
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ৳{stats.totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Total Courses
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-400">
            {stats.totalCourses}
          </div>
        </div>

        <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Reported Comments
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">
            {stats.reportedComments}
          </div>
        </div>

        <div
          onClick={() => setActiveTab("transactions")}
          className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1 cursor-pointer hover:border-amber-400 transition"
          title="Click to view transactions"
        >
          <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Pending Requests</span>
            {pendingTrxCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {pendingTrxCount}
          </div>
          <div className="text-[10px] text-amber-300 font-semibold">
            Click to manage & approve →
          </div>
        </div>
      </div>

      {/* Audit Feed */}
      <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-black flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          <span>Recent Admin Activity Logs</span>
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <div className="text-xs text-slate-500 py-4 text-center">
              No recent activity logged.
            </div>
          ) : (
            auditLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs flex justify-between items-center"
              >
                <div>
                  <span className="font-bold text-purple-300">
                    {log.adminName}
                  </span>
                  : <span className="text-slate-200">{log.action}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
