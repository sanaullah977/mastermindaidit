import React from "react";
import { GraduationCap } from "lucide-react";
import { User } from "../../../../types/platform";

interface TeachersTabProps {
  teachers: User[];
}

export const TeachersTab: React.FC<TeachersTabProps> = ({ teachers }) => {
  return (
    <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span>Faculty & Teachers Directory ({teachers.length})</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Instructors with teaching and curriculum management privileges.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-[#071325] rounded-2xl border border-slate-800 space-y-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/50"
              />
              <div>
                <div className="font-extrabold text-white text-sm">
                  {t.name}
                </div>
                <div className="text-[10px] text-purple-400 font-semibold">
                  {t.email}
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {t.status}
                </span>
              </div>
            </div>
            {t.bio && (
              <p className="text-xs text-slate-400 line-clamp-2">{t.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
