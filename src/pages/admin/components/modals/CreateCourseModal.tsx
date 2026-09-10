import React, { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import {
  Category,
  CourseLevel,
  CourseStatus,
  User,
} from "../../../../types/platform";
import { DBService } from "../../../../services/db";
import { COURSE_THUMBNAIL_PRESETS } from "../../constants";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  teachers: User[];
  currentUser: User | null;
  onCourseCreated: (msg: string) => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  categories,
  teachers,
  currentUser,
  onCourseCreated,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [newBengaliTitle, setNewBengaliTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Web Development");
  const [newLevel, setNewLevel] = useState<CourseLevel>("All Levels");
  const [newPrice, setNewPrice] = useState("2500");
  const [newDiscountPrice, setNewDiscountPrice] = useState("");
  const [newIsFree, setNewIsFree] = useState(false);
  const [newDurationHours, setNewDurationHours] = useState("12");
  const [newStatus, setNewStatus] = useState<CourseStatus>("PUBLISHED");
  const [newTeacherId, setNewTeacherId] = useState("");
  const [newBadge, setNewBadge] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  );
  const [newDescription, setNewDescription] = useState("");
  const [newBengaliDescription, setNewBengaliDescription] = useState("");
  const [newFeatures, setNewFeatures] = useState(
    "বাস্তবধর্মী লাইভ প্রজেক্ট\nলাইফটাইম এক্সেস ও মেম্বারশিপ\nঅভিজ্ঞ মেন্টর সাপোর্ট\nকোর্স সমাপ্তি সার্টিফিকেট",
  );
  const [newRequirements, setNewRequirements] = useState(
    "বেসিক কম্পিউটার ও ইন্টারনেট ব্যবহারের ধারণা\nশেখার আগ্রহ ও নিয়মিত অনুশীলনের মানসিকতা",
  );

  if (!isOpen) return null;

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Course title is required.");
      return;
    }

    const parsedPrice = parseFloat(newPrice) || 0;
    const isFreeFinal = newIsFree || parsedPrice === 0;
    const finalPrice = isFreeFinal ? 0 : parsedPrice;
    const discountNum = newDiscountPrice
      ? parseFloat(newDiscountPrice)
      : undefined;
    const selectedTeacher =
      teachers.find((t) => t.id === newTeacherId) || teachers[0];

    const parsedFeatures = newFeatures
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedRequirements = newRequirements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const created = DBService.createCourse(
      {
        title: newTitle.trim(),
        bengaliTitle: newBengaliTitle.trim() || newTitle.trim(),
        slug: newTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        description:
          newDescription.trim() ||
          "Comprehensive practical masterclass designed for career success.",
        bengaliDescription:
          newBengaliDescription.trim() ||
          newDescription.trim() ||
          "বাস্তবধর্মী ও ক্যারিয়ারমুখী পরিপূর্ণ কোর্স।",
        thumbnail: newThumbnail.trim() || COURSE_THUMBNAIL_PRESETS[0].url,
        image: newThumbnail.trim() || COURSE_THUMBNAIL_PRESETS[0].url,
        price: finalPrice,
        originalPrice: discountNum,
        discountPrice: discountNum,
        isFree: isFreeFinal,
        category: newCategory,
        categoryId: newCategory
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        level: newLevel,
        durationHours: parseInt(newDurationHours) || 12,
        status: newStatus,
        teacherId: selectedTeacher?.id || "usr-teacher-1",
        teacherName: selectedTeacher?.name || "Hasibul Islam",
        teacherAvatar: selectedTeacher?.avatar,
        badge: newBadge.trim() || undefined,
        rating: 5,
        reviewCount: 1,
        studentsCount: 0,
        lessonsCount: 10,
        requirements:
          parsedRequirements.length > 0
            ? parsedRequirements
            : ["Basic computer & internet knowledge"],
        features:
          parsedFeatures.length > 0
            ? parsedFeatures
            : [
                "Lifetime Access",
                "Certificate of Completion",
                "Dedicated Mentor Support",
              ],
        lessons: [],
      },
      currentUser?.name || "Admin",
    );

    onCourseCreated(`Course "${created.title}" successfully created!`);
    onClose();

    // Reset Form
    setNewTitle("");
    setNewBengaliTitle("");
    setNewPrice("2500");
    setNewDiscountPrice("");
    setNewIsFree(false);
    setNewBadge("");
    setNewDescription("");
    setNewBengaliDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Create New Course
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  New
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                নতুন কোর্স তৈরি ও পাবলিশ করতে নিচের তথ্যগুলো পূরণ করুন।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleCreateCourseSubmit}
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
                placeholder="e.g. Modern Full-Stack Web Development 2026"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1.5 font-bold">
                বাংলা শিরোনাম (Bengali Title)
              </label>
              <input
                type="text"
                placeholder="যেমন: আধুনিক ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট ২০২৬"
                value={newBengaliTitle}
                onChange={(e) => setNewBengaliTitle(e.target.value)}
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
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                {!categories.some((c) => c.name === newCategory) &&
                  newCategory && (
                    <option value={newCategory}>{newCategory}</option>
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
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value as any)}
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
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
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
                  checked={newIsFree}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNewIsFree(checked);
                    if (checked) {
                      if (parseFloat(newPrice) > 0) {
                        setNewDiscountPrice(newPrice);
                      }
                      setNewPrice("0");
                    } else {
                      if (parseFloat(newPrice) === 0 || !newPrice) {
                        setNewPrice(
                          newDiscountPrice && parseFloat(newDiscountPrice) > 0
                            ? newDiscountPrice
                            : "2500",
                        );
                      }
                    }
                  }}
                  className="w-4 h-4 rounded text-purple-600 bg-[#0A192F] border-slate-700 focus:ring-0"
                />
                <span className="text-xs font-extrabold text-emerald-400">
                  {newIsFree
                    ? "✓ Free Course (ফ্রি কোর্স)"
                    : "This is a FREE Course (ফ্রি কোর্স)"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-bold">
                  Selling Price (BDT ৳){" "}
                  {newIsFree && (
                    <span className="text-emerald-400">(FREE - 0 ৳)</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 2500"
                  value={newPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewPrice(val);
                    const num = parseFloat(val);
                    if (!isNaN(num) && num > 0) {
                      setNewIsFree(false);
                    } else if (num === 0) {
                      setNewIsFree(true);
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
                  value={newDiscountPrice}
                  onChange={(e) => setNewDiscountPrice(e.target.value)}
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
                  value={newDurationHours}
                  onChange={(e) => setNewDurationHours(e.target.value)}
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
                value={newTeacherId}
                onChange={(e) => setNewTeacherId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Default: Hasibul Islam</option>
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
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
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
                  onClick={() => setNewThumbnail(preset.url)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                    newThumbnail === preset.url
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
                value={newThumbnail}
                onChange={(e) => setNewThumbnail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
              />

              {/* Thumbnail Preview Box */}
              <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                <img
                  src={newThumbnail || COURSE_THUMBNAIL_PRESETS[0].url}
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
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
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
                value={newBengaliDescription}
                onChange={(e) => setNewBengaliDescription(e.target.value)}
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
                value={newFeatures}
                onChange={(e) => setNewFeatures(e.target.value)}
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
                value={newRequirements}
                onChange={(e) => setNewRequirements(e.target.value)}
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
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-extrabold shadow-lg shadow-purple-900/40 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create & Publish Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
