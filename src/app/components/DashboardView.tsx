import { Link } from "react-router";
import {
  FolderKanban,
  CheckSquare,
  TrendingUp,
  Clock,
  ArrowRight,
  Flame,
  Target,
  Award,
  MapPin,
  ChevronRight,
  AlertCircle,
  Tag,
  AlertTriangle,
  History,
  XCircle
} from "lucide-react";
import { useData } from "../context/DataContext";
import { COLOR_MAP, getTimeString, DAYS } from "../data/mockData";

// Today is Thursday March 12, 2026 — day index 3 (Thu)
const TODAY_DAY = "Thu";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-800 leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function CurrentTimeIndicator() {
  const now = new Date();
  const hours = now.getHours();
  const mins = now.getMinutes();
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const timeStr = `${displayHour}:${String(mins).padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
      <span>Bây giờ: {timeStr}</span>
    </div>
  );
}

export function DashboardView() {
  const { events, tasks, categories } = useData();

  const todayEvents = events.filter((e) => e.day === TODAY_DAY).sort(
    (a, b) => a.startHour - b.startHour || a.startMin - b.startMin
  );

  const upcomingTasks = tasks.filter((t) => !t.completed).slice(0, 4);
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalEvents = events.length;
  const highPriority = tasks.filter((t) => !t.completed && t.priority === "Cao").length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Custom date parser for formats like "14 Th3"
  const parseViDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes("Th")) return new Date(); // fallback
    const parts = dateStr.split(" Th");
    // Assuming current year 2026 for mock data context
    return new Date(2026, parseInt(parts[1]) - 1, parseInt(parts[0]));
  };

  const today = new Date(2026, 2, 12); // Mock today is March 12, 2026

  // Tasks with due dates before today
  const delayedTasks = tasks.filter((t) => !t.completed && parseViDate(t.dueDate) < today).slice(0, 3);
  
  // Tasks specifically marked as abandoned (e.g. older than 7 days)
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const abandonedTasks = tasks.filter((t) => !t.completed && parseViDate(t.dueDate) < sevenDaysAgo).slice(0, 3);


  // Category stats
  const categoryStats = categories.map(cat => {
    const catEvents = events.filter(e => e.categoryId === cat.id).length;
    const catTasks = tasks.filter(t => t.categoryId === cat.id);
    const catCompleted = catTasks.filter(t => t.completed).length;
    const progress = catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0;
    return {
      ...cat,
      eventCount: catEvents,
      progress,
    };
  }).slice(0, 6);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-gray-900">{getGreeting()}! 👋</h1>
          <p className="text-xs text-gray-400 mt-0.5">Thứ năm, 12 tháng 3, 2026 · Tuần 11</p>
        </div>
        <div className="flex items-center gap-3">
          <CurrentTimeIndicator />
          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-2">
            <Flame size={14} className="text-orange-500" />
            <span className="text-xs font-medium text-indigo-700">Chuỗi 7 ngày</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            icon={FolderKanban}
            label="Sự kiện tuần này"
            value={totalEvents}
            sub={`${categories.length} danh mục`}
            color="bg-indigo-500"
          />
          <StatCard
            icon={CheckSquare}
            label="Công việc hoàn thành"
            value={`${completedCount}/${tasks.length}`}
            sub={`${completionRate}% hoàn tất`}
            color="bg-emerald-500"
          />
          <StatCard
            icon={AlertCircle}
            label="Ưu tiên cao"
            value={highPriority}
            sub="Đang chờ xử lý"
            color="bg-rose-500"
          />
          <StatCard
            icon={Target}
            label="Hôm nay"
            value={todayEvents.length}
            sub="Sự kiện"
            color="bg-purple-500"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Today's schedule - spans 2 cols */}
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-gray-400" />
                <h3 className="text-gray-800">Lịch hôm nay</h3>
                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  Thứ năm
                </span>
              </div>
              <Link
                to="/timetable"
                className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                Xem tất cả <ArrowRight size={11} />
              </Link>
            </div>
            <div className="p-4 space-y-2.5">
              {todayEvents.length === 0 ? (
                <div className="py-8 text-center text-gray-300 text-sm">Không có sự kiện nào hôm nay</div>
              ) : (
                todayEvents.map((event) => {
                  const colors = COLOR_MAP[event.color];
                  const timeStr = getTimeString(event.startHour, event.startMin, event.duration);
                  const now = new Date();
                  const nowDecimal = now.getHours() + now.getMinutes() / 60;
                  const startDecimal = event.startHour + event.startMin / 60;
                  const endDecimal = startDecimal + event.duration;
                  const isNow = nowDecimal >= startDecimal && nowDecimal < endDecimal;
                  const isPast = nowDecimal >= endDecimal;
                  const category = categories.find(c => c.id === event.categoryId);

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isNow
                          ? `${colors.light} border-l-4 ${colors.border} shadow-sm`
                          : isPast
                          ? "bg-gray-50 border-gray-100 opacity-60"
                          : "bg-gray-50/50 border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      {/* Time */}
                      <div className="text-center flex-shrink-0 w-16">
                        <p className="text-[11px] font-semibold text-gray-500">
                          {event.startHour > 12 ? event.startHour - 12 : event.startHour}:
                          {String(event.startMin).padStart(2, "0")}
                        </p>
                        <p className="text-[10px] text-gray-400">{event.startHour >= 12 ? "CH" : "SA"}</p>
                      </div>

                      {/* Color bar */}
                      <div className={`w-1 h-10 rounded-full flex-shrink-0 ${colors.dot}`} />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-700 truncate">{event.title}</p>
                          {isNow && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${colors.badge}`}>
                              Đang diễn ra
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <Clock size={9} /> {timeStr}
                          </span>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                            <MapPin size={9} /> {event.location}
                          </span>
                          {category && (
                            <>
                              <span className="text-[10px] text-gray-300">·</span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                <Tag size={9} /> {category.name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare size={15} className="text-gray-400" />
                <h3 className="text-gray-800">Sắp đến hạn</h3>
              </div>
              <Link
                to="/tasks"
                className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1 transition-colors"
              >
                Tất cả <ArrowRight size={11} />
              </Link>
            </div>
            <div className="p-4 space-y-2.5">
              {upcomingTasks.length === 0 ? (
                <div className="py-8 text-center text-gray-300 text-sm">Không có công việc</div>
              ) : (
                upcomingTasks.map((task) => {
                  const category = categories.find(c => c.id === task.categoryId);
                  const colors = category ? COLOR_MAP[category.color] : COLOR_MAP[task.color];
                  const priorityColor = {
                    Cao: "text-rose-500",
                    "Trung bình": "text-amber-500",
                    Thấp: "text-emerald-500",
                  }[task.priority];

                  return (
                    <div key={task.id} className="flex items-start gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${colors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{task.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400">{task.dueDate}</span>
                          <span className={`text-[10px] font-medium ${priorityColor}`}>· {task.priority}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {upcomingTasks.length > 0 && (
                <Link
                  to="/tasks"
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-600 transition-colors pt-1"
                >
                  Xem tất cả <ChevronRight size={11} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Delayed & Abandoned Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Delayed Tasks */}
          <div className="bg-orange-50/50 rounded-2xl border border-orange-100 overflow-hidden">
            <div className="px-4 py-4 border-b border-orange-100/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-orange-500" />
                <h3 className="text-orange-900 font-medium">Trì trệ (Quá hạn)</h3>
              </div>
              <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                {delayedTasks.length} task
              </span>
            </div>
            <div className="p-4 space-y-3">
              {delayedTasks.length === 0 ? (
                <div className="text-center text-orange-300 text-sm py-2">Tuyệt vời! Không có việc nào quá hạn.</div>
              ) : (
                delayedTasks.map((task) => {
                  return (
                    <div key={task.id} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-orange-100/50 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <History size={14} className="text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{task.title}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-1.5 py-0.5 rounded">Hạn: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Abandoned / At Risk */}
          <div className="bg-red-50/50 rounded-2xl border border-red-100 overflow-hidden">
            <div className="px-4 py-4 border-b border-red-100/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle size={15} className="text-red-500" />
                <h3 className="text-red-900 font-medium">Bỏ dở (Quá hạn {">"}7 ngày)</h3>
              </div>
              <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                {abandonedTasks.length} task
              </span>
            </div>
            <div className="p-4 space-y-3">
              {abandonedTasks.length === 0 ? (
                <div className="text-center text-red-300 text-sm py-2">Chưa có mục tiêu nào bị bỏ dở.</div>
              ) : (
                abandonedTasks.map((task) => {
                  return (
                    <div key={task.id} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-red-100/50 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <XCircle size={14} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{task.title}</p>
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">Nguy cơ không hoàn thành cao</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Category progress */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-gray-400" />
              <h3 className="text-gray-800">Tiến độ danh mục</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <Award size={13} className="text-amber-500" />
              <span className="text-xs text-gray-400">Tháng 3, 2026</span>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {categoryStats.map((cat) => {
                const colors = COLOR_MAP[cat.color];
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                        <span className="text-xs text-gray-600 font-medium">{cat.name}</span>
                      </div>
                      <span className={`text-xs font-semibold ${colors.text}`}>{cat.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${colors.bg}`}
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">{cat.eventCount} sự kiện</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}