import React, { useState, useEffect } from "react";
import { Edit3, X, Sparkles } from "lucide-react";
import {
  Course,
  Category,
  CourseLevel,
  CourseStatus,
  User,
} from "../../../../types/platform";
import { DBService } from "../../../../services/db";
import { COURSE_THUMBNAIL_PRESETS } from "../../constants";

interface EditCourseModalProps {
  editingCourse: Course | null;
  onClose: () => void;
  categories: Category[];
  teachers: User[];
  currentUser: User | null;
  onCourseUpdated: (msg: string) => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  editingCourse,
  onClose,
  categories,
  teachers,
  currentUser,
  onCourseUpdated,
}) => {
  const [editTitle, setEditTitle] = useState("");
  const [editBengaliTitle, setEditBengaliTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editBengaliDescription, setEditBengaliDescription] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [editPrice, setEditPrice] = useState("2500");
  const [editDiscountPrice, setEditDiscountPrice] = useState("");
  const [editIsFree, setEditIsFree] = useState(false);
  const [editCategory, setEditCategory] = useState("Web Development");
  const [editLevel, setEditLevel] = useState<CourseLevel>("All Levels");
  const [editDuration, setEditDuration] = useState("12");
  const [editStatus, setEditStatus] = useState<CourseStatus>("PUBLISHED");
  const [editBadge, setEditBadge] = useState("");
  const [editTeacherId, setEditTeacherId] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  const [editRequirements, setEditRequirements] = useState("");

  useEffect(() => {
    if (editingCourse) {
      setEditTitle(editingCourse.title || "");
      setEditBengaliTitle(
        editingCourse.bengaliTitle || editingCourse.title || "",
      );
      setEditDescription(editingCourse.description || "");
      setEditBengaliDescription(editingCourse.bengaliDescription || "");
      setEditThumbnail(
        editingCourse.thumbnail ||
          (editingCourse as any).image ||
          COURSE_THUMBNAIL_PRESETS[0].url,
      );
      const isActuallyFree = Boolean(
        editingCourse.isFree || editingCourse.price === 0,
      );
      setEditIsFree(isActuallyFree);
      setEditPrice(isActuallyFree ? "0" : editingCourse.price.toString());
      setEditDiscountPrice(
        editingCourse.discountPrice
          ? editingCourse.discountPrice.toString()
          : editingCourse.originalPrice
            ? editingCourse.originalPrice.toString()
            : "",
      );
      setEditCategory(editingCourse.category || "Web Development");
      setEditLevel(editingCourse.level || "All Levels");
      setEditDuration(
        editingCourse.durationHours
          ? editingCourse.durationHours.toString()
          : "12",
      );
      setEditStatus(editingCourse.status || "PUBLISHED");
      setEditBadge(editingCourse.badge || "");
      setEditTeacherId(editingCourse.teacherId || teachers[0]?.id || "");
      setEditFeatures((editingCourse.features || []).join("\n"));
      setEditRequirements((editingCourse.requirements || []).join("\n"));
    }
  }, [editingCourse, teachers]);

  if (!editingCourse) return null;

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editTitle.trim()) return;

    const parsedPrice = parseFloat(editPrice) || 0;
    const isFreeFinal = editIsFree || parsedPrice === 0;
    const finalPrice = isFreeFinal ? 0 : parsedPrice;
    const discountNum = editDiscountPrice
      ? parseFloat(editDiscountPrice)
      : undefined;
    const selectedTeacher = teachers.find((t) => t.id === editTeacherId);

    const parsedFeatures = editFeatures
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedRequirements = editRequirements
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = DBService.updateCourse(
      editingCourse.id,
      {
        title: editTitle.trim(),
        bengaliTitle: editBengaliTitle.trim() || editTitle.trim(),
        description: editDescription.trim(),
        bengaliDescription: editBengaliDescription.trim(),
        thumbnail: editThumbnail.trim() || editingCourse.thumbnail,
        image: editThumbnail.trim() || editingCourse.thumbnail,
        price: finalPrice,
        originalPrice: discountNum,
        discountPrice: discountNum,
        isFree: isFreeFinal,
        category: editCategory,
        categoryId: editCategory
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        level: editLevel,
        durationHours: parseInt(editDuration) || 12,
        status: editStatus,
        badge: editBadge.trim() || undefined,
        teacherId: selectedTeacher
          ? selectedTeacher.id
          : editTeacherId || editingCourse.teacherId,
        teacherName: selectedTeacher
          ? selectedTeacher.name
          : editingCourse.teacherName || "Hasibul Islam",
        teacherAvatar: selectedTeacher
          ? selectedTeacher.avatar
          : editingCourse.teacherAvatar,
        features:
          parsedFeatures.length > 0 ? parsedFeatures : editingCourse.features,
        requirements:
          parsedRequirements.length > 0
            ? parsedRequirements
            : editingCourse.requirements,
      },
      currentUser?.name || "Admin",
    );

    onCourseUpdated(
      `Course "${updated?.title || editTitle}" updated successfully!`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 shadow-lg">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Edit Course
                <span className="text-[10px] text-slate-400 font-mono">
                  ({editingCourse.id})
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update course details, pricing, level, and content across all
                platform pages.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSaveEditCourse}
          className="space-y-5 text-xs font-bold"
        >
          {/* Row 1: Title English & Bengali */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Course Title (English) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                বাংলা শিরোনাম (Bengali Title)
              </label>
              <input
                type="text"
                value={editBengaliTitle}
                onChange={(e) => setEditBengaliTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Row 2: Category, Level & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                {!categories.some((c) => c.name === editCategory) &&
                  editCategory && (
                    <option value={editCategory}>{editCategory}</option>
                  )}
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Course Level
              </label>
              <select
                value={editLevel}
                onChange={(e) => setEditLevel(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="All Levels">All Levels (সকল স্তর)</option>
                <option value="Beginner">Beginner (প্রাথমিক)</option>
                <option value="Intermediate">Intermediate (মধ্যম)</option>
                <option value="Advanced">Advanced (উন্নত)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Publication Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold"
              >
                <option value="PUBLISHED">PUBLISHED (সরাসরি লাইভ)</option>
                <option value="DRAFT">DRAFT (খসড়া)</option>
                <option value="UNPUBLISHED">UNPUBLISHED (লুকানো)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Pricing & Duration */}
          <div className="p-4 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                Pricing & Schedule
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={editIsFree}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEditIsFree(checked);
                    if (checked) {
                      if (parseFloat(editPrice) > 0) {
                        setEditDiscountPrice(editPrice);
                      }
                      setEditPrice("0");
                    } else {
                      if (parseFloat(editPrice) === 0 || !editPrice) {
                        setEditPrice(
                          editDiscountPrice && parseFloat(editDiscountPrice) > 0
                            ? editDiscountPrice
                            : "2500",
                        );
                      }
                    }
                  }}
                  className="w-4 h-4 rounded text-purple-600 bg-[#0A192F] border-slate-700 focus:ring-0"
                />
                <span className="text-xs font-extrabold text-emerald-400">
                  {editIsFree
                    ? "✓ Free Course (ফ্রি কোর্স)"
                    : "This is a FREE Course (ফ্রি কোর্স)"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-bold">
                  Selling Price (BDT ৳){" "}
                  {editIsFree && (
                    <span className="text-emerald-400">(FREE - 0 ৳)</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 2500"
                  value={editPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditPrice(val);
                    const num = parseFloat(val);
                    if (!isNaN(num) && num > 0) {
                      setEditIsFree(false);
                    } else if (num === 0) {
                      setEditIsFree(true);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Original Price (Strikethrough ৳)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 4500 (optional)"
                  value={editDiscountPrice}
                  onChange={(e) => setEditDiscountPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">
                  Total Duration (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 12"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Instructor & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Assigned Teacher
              </label>
              <select
                value={editTeacherId}
                onChange={(e) => setEditTeacherId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Bestseller, New, Popular, Featured"
                value={editBadge}
                onChange={(e) => setEditBadge(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Row 5: Thumbnail with Presets and Live Preview */}
          <div className="p-4 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-purple-400 tracking-wider">
                Thumbnail Image
              </label>
              <span className="text-[10px] text-slate-400">
                Click a preset below or enter custom URL
              </span>
            </div>

            {/* Preset Chips */}
            <div className="flex flex-wrap gap-1.5">
              {COURSE_THUMBNAIL_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setEditThumbnail(preset.url)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    editThumbnail === preset.url
                      ? "bg-purple-600 text-white"
                      : "bg-[#0A192F] hover:bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={editThumbnail}
                onChange={(e) => setEditThumbnail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
              />

              {/* Thumbnail Preview Box */}
              <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                <img
                  src={editThumbnail || COURSE_THUMBNAIL_PRESETS[0].url}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      COURSE_THUMBNAIL_PRESETS[0].url;
                  }}
                />
                <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[8px] px-1 py-0.2 rounded text-white font-mono">
                  Preview
                </span>
              </div>
            </div>
          </div>

          {/* Row 6: Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Course Summary (English)
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of the course content and learning goals..."
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                কোর্সের বিবরণ (Bengali)
              </label>
              <textarea
                rows={3}
                placeholder="কোর্সের বাংলা সংক্ষিপ্ত বিবরণ ও শিক্ষার্থীদের অর্জিত দক্ষতা..."
                value={editBengaliDescription}
                onChange={(e) => setEditBengaliDescription(e.target.value)}
                className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Row 7: Key Features & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Key Features / What You'll Learn{" "}
                <span className="text-[10px] text-slate-400">
                  (one per line)
                </span>
              </label>
              <textarea
                rows={3}
                value={editFeatures}
                onChange={(e) => setEditFeatures(e.target.value)}
                className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                Prerequisites / Requirements{" "}
                <span className="text-[10px] text-slate-400">
                  (one per line)
                </span>
              </label>
              <textarea
                rows={3}
                value={editRequirements}
                onChange={(e) => setEditRequirements(e.target.value)}
                className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow-lg shadow-purple-900/40 transition cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
