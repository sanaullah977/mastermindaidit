import React from "react";
import { Trash2 } from "lucide-react";
import { Category } from "../../../../types/platform";

interface CategoriesTabProps {
  categories: Category[];
  newCatName: string;
  setNewCatName: (name: string) => void;
  newCatBengali: string;
  setNewCatBengali: (name: string) => void;
  onCreateCategory: (e: React.FormEvent) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  newCatName,
  setNewCatName,
  newCatBengali,
  setNewCatBengali,
  onCreateCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-6">
      <h3 className="text-lg font-black">Manage Course Categories</h3>

      <form onSubmit={onCreateCategory} className="grid sm:grid-cols-3 gap-3">
        <input
          type="text"
          required
          placeholder="Category Name (e.g. AI & Machine Learning)"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white"
        />
        <input
          type="text"
          placeholder="Bengali Name"
          value={newCatBengali}
          onChange={(e) => setNewCatBengali(e.target.value)}
          className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white"
        />
        <button
          type="submit"
          className="py-2.5 bg-purple-600 text-white rounded-xl text-xs font-extrabold shadow"
        >
          + Add Category
        </button>
      </form>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 bg-[#071325] rounded-2xl border border-slate-800 flex justify-between items-center text-xs"
          >
            <div>
              <div className="font-bold text-white">{cat.name}</div>
              <div className="text-[10px] text-purple-400 font-semibold">
                {cat.bengaliName}
              </div>
            </div>
            <button
              onClick={() => onDeleteCategory(cat.id)}
              className="text-rose-400 hover:text-rose-300"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
