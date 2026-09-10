import React from "react";
import { Link } from "react-router-dom";
import {
  Layout,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  ShieldCheck,
  LogOut,
  Star,
  MessageSquare,
  Tag,
  History,
  Globe,
  User as UserIcon,
} from "lucide-react";
import { User } from "../../../types/platform";

export type AdminTab =
  | "overview"
  | "courses"
  | "users"
  | "teachers"
  | "reviews"
  | "comments"
  | "transactions"
  | "categories"
  | "audit"
  | "administrators"
  | "website-content";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingTrxCount: number;
  currentUser: User | null;
  onOpenAdminProfile: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTrxCount,
  currentUser,
  onOpenAdminProfile,
  onLogout,
}) => {
  return (
    <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white font-black shadow-lg">
            A
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight">
              MASTERMIND AIDIT Admin
            </h2>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
              Super CMS Portal
            </span>
          </div>
        </Link>

        <nav className="space-y-1 text-xs font-bold">
          {[
            {
              id: "overview",
              label: "Overview & Analytics",
              icon: <Layout className="w-4 h-4" />,
            },
            {
              id: "website-content",
              label: "Website Content & CMS",
              icon: <Globe className="w-4 h-4 text-sky-400" />,
            },
            {
              id: "courses",
              label: "Course Management",
              icon: <BookOpen className="w-4 h-4" />,
            },
            {
              id: "users",
              label: "Users & Roles",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "teachers",
              label: "Teachers",
              icon: <GraduationCap className="w-4 h-4" />,
            },
            {
              id: "reviews",
              label: "Reviews Moderation",
              icon: <Star className="w-4 h-4 text-amber-400" />,
            },
            {
              id: "comments",
              label: "Comments & Reports",
              icon: <MessageSquare className="w-4 h-4 text-rose-400" />,
            },
            {
              id: "transactions",
              label: "Transactions Ledger",
              icon: <CreditCard className="w-4 h-4 text-emerald-400" />,
              badge: pendingTrxCount,
            },
            {
              id: "categories",
              label: "Category Manager",
              icon: <Tag className="w-4 h-4" />,
            },
            {
              id: "administrators",
              label: "Admins & Access Codes",
              icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
            },
            {
              id: "audit",
              label: "Audit Logs",
              icon: <History className="w-4 h-4 text-slate-400" />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                activeTab === item.id
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-3">
        <div
          onClick={onOpenAdminProfile}
          className="flex items-center gap-2.5 text-xs text-slate-300 p-2 rounded-2xl hover:bg-white/5 cursor-pointer transition border border-transparent hover:border-purple-500/30"
          title="Click to edit Admin Profile & Password"
        >
          <img
            src={
              currentUser?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            }
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-400 shrink-0"
          />
          <div className="truncate">
            <div className="font-bold truncate text-white">
              {currentUser?.name}
            </div>
            <div className="text-[10px] text-purple-400 font-semibold truncate">
              {currentUser?.email}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAdminProfile}
          className="w-full flex items-center justify-center gap-2 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <UserIcon className="w-3.5 h-3.5" /> Profile & Security
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
