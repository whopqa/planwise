import { NavLink } from "react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CheckSquare,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Tag,
  Plus,
  Target,
  Zap,
  Activity,
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { useData } from "../context/DataContext";
import { COLOR_MAP } from "../data/mockData";
import { CategoryModal } from "./CategoryModal";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MARCH_2026 = {
  startDay: 0, // Sunday
  totalDays: 31,
  today: 12,
};

function MiniCalendar() {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const cells: (number | null)[] = [];
  for (let i = 0; i < MARCH_2026.startDay; i++) cells.push(null);
  for (let i = 1; i <= MARCH_2026.totalDays; i++) cells.push(i);

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white/70">March 2026</span>
        <div className="flex gap-1">
          <button className="text-white/40 hover:text-white/80 transition-colors">
            <ChevronLeft size={13} />
          </button>
          <button className="text-white/40 hover:text-white/80 transition-colors">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((d) => (
          <div key={d} className="text-center text-[9px] text-white/30 font-medium py-0.5">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className={`
              text-center text-[11px] py-0.5 rounded-full cursor-pointer leading-5
              ${day === null ? "" : "hover:bg-white/10 text-white/60"}
              ${day === MARCH_2026.today ? "!bg-indigo-500 !text-white font-semibold" : ""}
              ${day !== null && day >= 9 && day <= 15 && day !== MARCH_2026.today ? "bg-white/5 text-white/80" : ""}
            `}
          >
            {day ?? ""}
          </div>
        ))}
      </div>
    </div>
  );
}

const navItems = [
  { path: "/", label: "Bảng điều khiển", icon: LayoutDashboard },
  { path: "/goals", label: "Bảng tầm nhìn và mục tiêu", icon: Target },
  { path: "/habits", label: "Habit Tracker", icon: Activity },
  { path: "/timetable", label: "Lịch tuần", icon: CalendarDays },
  { path: "/calendar", label: "Lịch tháng", icon: Calendar },
  { path: "/tasks", label: "Công việc", icon: CheckSquare },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { categories } = useData();
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  return (
    <div
      className={`
        relative flex flex-col bg-slate-900 flex-shrink-0 transition-all duration-300 ease-in-out
        ${isOpen ? "w-60" : "w-16"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 h-16">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
          <FolderKanban size={15} className="text-white" />
        </div>
        {isOpen && (
          <div className="min-w-0">
            <div className="text-white font-bold text-base tracking-wide leading-tight flex items-center gap-1.5" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
              Plan<span className="text-indigo-400">Wise</span>
            </div>
            <div className="text-white/40 text-[10px] uppercase tracking-wider font-semibold mt-0.5">Quản lý thời gian</div>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[26px] w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-500 z-20 transition-colors"
      >
        {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* Navigation */}
      <nav className="py-4 px-2 space-y-0.5">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
              ${isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-white/50 hover:bg-white/8 hover:text-white/90"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className="flex-shrink-0" />
                {isOpen && (
                  <span className={`text-sm ${isActive ? "text-white" : ""}`}>{label}</span>
                )}
                {isOpen && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>



      {/* Divider */}
      {isOpen && <div className="mx-4 border-t border-white/8 my-1" />}

      {/* Categories */}
      {isOpen && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={13} className="text-white/40" />
            <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold flex-1">Danh mục</span>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="text-white/40 hover:text-white/70 transition-colors"
              title="Quản lý danh mục"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {categories.map((cat) => {
              const colors = COLOR_MAP[cat.color];
              return (
                <div key={cat.id} className="flex items-center gap-2 group">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                  <span className="text-[11px] text-white/55 truncate flex-1">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1" />

      {/* Mini Calendar */}
      {isOpen && (
        <div className="border-t border-white/8 pt-3">
          <div className="px-4 mb-2">
            <span className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Tháng này</span>
          </div>
          <MiniCalendar />
        </div>
      )}

      {/* User profile */}
      <div className="border-t border-white/10 p-3 mt-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow">
            <User size={13} className="text-white" />
          </div>
          {isOpen && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-white/90 font-medium truncate">Nguyễn Văn A</div>
                <div className="text-[11px] text-white/40 truncate">Người dùng</div>
              </div>
              <button className="text-white/30 hover:text-white/70 transition-colors">
                <Bell size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {showCategoryModal && <CategoryModal onClose={() => setShowCategoryModal(false)} />}
    </div>
  );
}