import React from "react";
import {BookOpen, Plus,Search,Edit3,Eye,EyeOff,Copy,Trash2,} from "lucide-react";
import { Course, Category } from "../../../../types/platform";

interface CoursesTabProps {
  coursesList: Course[];
  courseSearch: string;
  setCourseSearch: (query: string) => void;
  courseFilterCategory: string;
  setCourseFilterCategory: (category: string) => void;
  courseFilterStatus: "ALL" | "PUBLISHED" | "DRAFT" | "UNPUBLISHED";
  setCourseFilterStatus: (
    status: "ALL" | "PUBLISHED" | "DRAFT" | "UNPUBLISHED",
  ) => void;
  categories: Category[];
  onOpenCreateCourse: () => void;
  onOpenEditCourse: (course: Course) => void;
  onAddVideo: (course: Course) => void;
  onAddPdf: (course: Course) => void;
  onTogglePublishCourse: (course: Course) => void;
  onDuplicateCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  coursesList,
  courseSearch,
  setCourseSearch,
  courseFilterCategory,
  setCourseFilterCategory,
  courseFilterStatus,
  setCourseFilterStatus,
  categories,
  onOpenCreateCourse,
  onOpenEditCourse,
  onAddVideo,
  onAddPdf,
  onTogglePublishCourse,
  onDuplicateCourse,
  onDeleteCourse,
}) => {
  const filteredCourses = coursesList.filter((c) => {
    if (courseFilterStatus !== "ALL" && c.status !== courseFilterStatus)
      return false;
    if (
      courseFilterCategory !== "ALL" &&
      c.category.toLowerCase() !== courseFilterCategory.toLowerCase()
    )
      return false;
    if (courseSearch.trim()) {
      const q = courseSearch.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchBengali = (c.bengaliTitle || "").toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      const matchTeacher = (c.teacherName || "").toLowerCase().includes(q);
      return matchTitle || matchBengali || matchCat || matchTeacher;
    }
    return true;
  });

  return (
    <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-5">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Course Management
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {coursesList.length} total
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Create, edit, attach video/PDF media, and publish courses live to
              students.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreateCourse}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-900/30 transition flex items-center gap-2 self-start lg:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title, teacher, category..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#071325] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={courseFilterCategory}
            onChange={(e) => setCourseFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-[#071325] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={courseFilterStatus}
            onChange={(e) => setCourseFilterStatus(e.target.value as any)}
            className="w-full px-3 py-2 bg-[#071325] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Statuses ({coursesList.length})</option>
            <option value="PUBLISHED">
              Published Only (
              {coursesList.filter((c) => c.status === "PUBLISHED").length})
            </option>
            <option value="DRAFT">
              Draft Only (
              {coursesList.filter((c) => c.status === "DRAFT").length})
            </option>
            <option value="UNPUBLISHED">
              Unpublished Only (
              {coursesList.filter((c) => c.status === "UNPUBLISHED").length})
            </option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Course Info</th>
              <th className="p-3">Category & Level</th>
              <th className="p-3">Price (BDT)</th>
              <th className="p-3">Instructor</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-300">
                    No courses match your filter.
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try resetting search or filters, or create a new course.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCourseSearch("");
                      setCourseFilterCategory("ALL");
                      setCourseFilterStatus("ALL");
                    }}
                    className="mt-3 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </td>
              </tr>
            ) : (
              filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-bold text-white flex items-center gap-3">
                    <img
                      src={
                        c.thumbnail ||
                        (c as any).image ||
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={c.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div
                        className="truncate max-w-xs font-extrabold text-white text-sm"
                        title={c.title}
                      >
                        {c.title}
                      </div>
                      {c.bengaliTitle && c.bengaliTitle !== c.title && (
                        <div className="text-[11px] text-purple-300/80 truncate max-w-xs">
                          {c.bengaliTitle}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {c.id}
                        </span>
                        {c.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                            {c.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-200">
                      {c.category}
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full inline-block mt-0.5">
                      {c.level || "All Levels"}
                    </span>
                  </td>
                  <td className="p-3 font-bold">
                    {c.isFree || c.price === 0 ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">
                        FREE
                      </span>
                    ) : (
                      <div>
                        <span className="text-emerald-400 font-extrabold text-sm">
                          ৳{c.price.toLocaleString()}
                        </span>
                        {c.discountPrice && c.discountPrice > c.price && (
                          <span className="text-slate-500 line-through text-[10px] ml-1.5">
                            ৳{c.discountPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="text-slate-300 font-medium">
                      {c.teacherName || "Hasibul Islam"}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {c.durationHours || 12} hrs
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : c.status === "DRAFT"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-700/60 text-slate-300 border border-slate-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenEditCourse(c)}
                      className="px-2.5 py-1.5 bg-[#071325] hover:bg-slate-800 text-purple-300 border border-slate-700 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 shadow-sm transition"
                      title="Edit Course Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddVideo(c)}
                      className="px-2.5 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition"
                      title="Add Video Lecture"
                    >
                      + Video
                    </button>

                    <button
                      type="button"
                      onClick={() => onAddPdf(c)}
                      className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition"
                      title="Attach PDF Resource"
                    >
                      + PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => onTogglePublishCourse(c)}
                      className={`p-1.5 rounded-xl text-[10px] font-bold border transition inline-flex items-center ${
                        c.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 text-slate-200"
                      }`}
                      title={
                        c.status === "PUBLISHED"
                          ? "Unpublish Course"
                          : "Publish Course Live"
                      }
                    >
                      {c.status === "PUBLISHED" ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDuplicateCourse(c)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition inline-flex items-center"
                      title="Duplicate Course"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteCourse(c.id)}
                      className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-xl transition inline-flex items-center"
                      title="Delete Course Permanently"
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
