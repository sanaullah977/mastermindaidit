import React from "react";
import { Star, Trash2 } from "lucide-react";
import { Review, ReviewStatus } from "../../../../types/platform";

interface ReviewsTabProps {
  reviews: Review[];
  onReviewStatus: (reviewId: string, status: ReviewStatus) => void;
  onDeleteReview: (reviewId: string) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  reviews,
  onReviewStatus,
  onDeleteReview,
}) => {
  return (
    <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
      <h3 className="text-lg font-black flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400" />
        <span>Reviews Moderation Engine</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Course</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Comment Text</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No reviews found.
                </td>
              </tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <td className="p-3 font-bold text-white">{r.userName}</td>
                  <td className="p-3 truncate max-w-xs">{r.courseTitle}</td>
                  <td className="p-3 text-amber-400 font-bold">{r.rating} ★</td>
                  <td className="p-3 max-w-xs truncate">{r.comment}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === "PUBLISHED" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {r.status !== "PUBLISHED" && (
                      <button
                        onClick={() => onReviewStatus(r.id, "PUBLISHED")}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== "HIDDEN" && (
                      <button
                        onClick={() => onReviewStatus(r.id, "HIDDEN")}
                        className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Hide
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteReview(r.id)}
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
