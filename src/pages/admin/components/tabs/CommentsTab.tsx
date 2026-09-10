import React from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Comment, CommentStatus } from "../../../../types/platform";

interface CommentsTabProps {
  comments: Comment[];
  onCommentStatus: (commentId: string, status: CommentStatus) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({
  comments,
  onCommentStatus,
  onDeleteComment,
}) => {
  return (
    <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
      <h3 className="text-lg font-black flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-rose-400" />
        <span>Comment Moderation & Reported Posts</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Author</th>
              <th className="p-3">Comment Content</th>
              <th className="p-3">Status</th>
              <th className="p-3">Report Reason</th>
              <th className="p-3 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No comments found.
                </td>
              </tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id}>
                  <td className="p-3 font-bold text-white">
                    {c.userName} ({c.userRole})
                  </td>
                  <td className="p-3 max-w-sm truncate">{c.text}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === "REPORTED" ? "bg-rose-500/20 text-rose-300" : "bg-slate-700 text-slate-300"}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-rose-400 font-bold">
                    {c.reportReason || "-"}
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => onCommentStatus(c.id, "PUBLISHED")}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                    >
                      Keep
                    </button>
                    <button
                      onClick={() => onCommentStatus(c.id, "HIDDEN")}
                      className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px]"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => onDeleteComment(c.id)}
                      className="p-1 bg-rose-500/20 text-rose-300 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
