import React from "react";
import { History } from "lucide-react";
import { AuditLog } from "../../../../types/platform";

interface AuditLogsTabProps {
  auditLogs: AuditLog[];
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ auditLogs }) => {
  return (
    <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
      <h3 className="text-lg font-black flex items-center gap-2">
        <History className="w-5 h-5 text-purple-400" />
        <span>Full System Audit Trail</span>
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs flex justify-between items-center"
          >
            <div>
              <span className="font-bold text-purple-300">{log.adminName}</span>
              : <span className="text-slate-200">{log.action}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
