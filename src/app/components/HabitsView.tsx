import { useState } from "react";
import { Plus, Flame, Calendar, CheckCircle2 } from "lucide-react";
import { HABITS, COLOR_MAP } from "../data/mockData";

export function HabitsView() {
  const [habits] = useState(HABITS);

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: "Hàng ngày",
      weekly: "Hàng tuần", 
      monthly: "Hàng tháng"
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const isCompletedToday = (habit: any) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div>
          <h1 className="text-gray-900 font-bold text-xl">Habit Tracker</h1>
          <p className="text-xs text-gray-400 mt-0.5">Xây dựng kỷ luật hàng ngày</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus size={14} />
          Thêm thói quen
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Habits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => {
             const colors = COLOR_MAP[habit.color];
             return (
              <div key={habit.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{habit.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{habit.description}</p>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    {getFrequencyLabel(habit.frequency)}
                  </div>
                </div>

                <div className="space-y-4 mt-5">
                  {/* Current Streak */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex flex-shrink-0 items-center justify-center">
                        <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400">Chuỗi hiện tại</span>
                         <span className="font-bold text-sm text-gray-800">{habit.currentStreak} ngày</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">Tốt nhất</span>
                      <span className="font-semibold text-xs text-gray-600">{habit.bestStreak}</span>
                    </div>
                  </div>

                  {/* Today's Status */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-medium text-gray-700">Hôm nay</span>
                    <button
                      className={`
                        text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors
                        ${isCompletedToday(habit) 
                          ? `${colors.bg} text-white shadow-sm` 
                          : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
                      `}
                    >
                      <CheckCircle2 size={14} className={isCompletedToday(habit) ? "text-white" : "text-gray-400"} />
                      {isCompletedToday(habit) ? "Hoàn thành" : "Đánh dấu"}
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="border-t border-gray-50 pt-3 mt-3">
                    <h4 className="text-[11px] text-gray-400 font-semibold mb-2.5 flex items-center gap-1">
                      <Calendar size={10} /> 7 ngày gần đây
                    </h4>
                    <div className="flex justify-between items-center px-1">
                      {Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (6 - i));
                        const dateStr = date.toISOString().split('T')[0];
                        const completed = habit.completedDates.includes(dateStr);
                        
                        return (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold ${
                              completed 
                                ? `${colors.bg} text-white shadow-sm` 
                                : 'bg-gray-100 text-gray-300'
                            }`}
                            title={date.toLocaleDateString('vi-VN')}
                          >
                             {['T2','T3','T4','T5','T6','T7','CN'][date.getDay() === 0 ? 6 : date.getDay()-1]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}