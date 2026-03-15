import { useState } from "react";
import { Plus, Target, Calendar, Briefcase, HeartPulse, Wallet, BookOpen } from "lucide-react";

export function GoalsView() {
  const VISION_ITEMS = [
    { id: 1, title: "Senior Developer", description: "Làm chủ công nghệ và dẫn dắt đội ngũ", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 2, title: "Khỏe mạnh & Năng động", description: "Duy trì thói quen chạy bộ và ăn uống lành mạnh", icon: HeartPulse, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: 3, title: "Tự do Tài chính", description: "Có khoản đầu tư sinh lời và quỹ dự phòng", icon: Wallet, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 4, title: "Học tập không ngừng", description: "Mỗi năm học thêm 1 ngôn ngữ hoặc kỹ năng mới", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" }
  ];

  const WEEKLY_GOALS = [
    { id: 11, title: "Đọc xong cuốn Atomic Habits", progress: 50, color: "bg-purple-500", text: "text-purple-600", bgSoft: "bg-purple-50" },
    { id: 12, title: "Chạy bộ tổng cộng 15km", progress: 80, color: "bg-emerald-500", text: "text-emerald-600", bgSoft: "bg-emerald-50" },
  ];
  const MONTHLY_GOALS = [
    { id: 21, title: "Hoàn thành khóa học React", progress: 65, color: "bg-blue-500", text: "text-blue-600", bgSoft: "bg-blue-50" },
    { id: 22, title: "Tiết kiệm 5 triệu", progress: 40, color: "bg-amber-500", text: "text-amber-600", bgSoft: "bg-amber-50" },
  ];
  const YEARLY_GOALS = [
    { id: 31, title: "Đạt IELTS 7.0", progress: 35, color: "bg-indigo-500", text: "text-indigo-600", bgSoft: "bg-indigo-50" },
    { id: 32, title: "Du lịch Nhật Bản", progress: 10, color: "bg-rose-500", text: "text-rose-600", bgSoft: "bg-rose-50" },
  ];

  const renderGoalCard = (goal: any) => (
    <div key={goal.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors bg-white hover:shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-sm text-gray-800 leading-tight pr-4">{goal.title}</h4>
        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${goal.bgSoft} ${goal.text}`}>
          {goal.progress}%
        </div>
      </div>
      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${goal.color}`} style={{ width: `${goal.progress}%` }} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-10">
        <div>
          <h1 className="text-gray-900 font-bold text-xl">Bảng tầm nhìn và mục tiêu</h1>
          <p className="text-xs text-gray-400 mt-0.5">La bàn định hướng và phân rã mục tiêu dài hạn</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus size={14} />
          Thêm mục tiêu
        </button>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* Tiêu điểm Tầm nhìn */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Bảng Tầm Nhìn</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VISION_ITEMS.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mục tiêu Phân rã */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Mục tiêu theo giai đoạn</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tuần */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Mục tiêu Tuần
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Hành động ngắn hạn</p>
              </div>
              <div className="p-5 space-y-3 flex-1 bg-gray-50/20">
                {WEEKLY_GOALS.map(renderGoalCard)}
                <button className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-xs font-medium text-gray-500 hover:bg-white hover:border-gray-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1">
                  <Plus size={13} /> Thêm mục tiêu tuần
                </button>
              </div>
            </div>

            {/* Tháng */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  Mục tiêu Tháng
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Xây dựng nền tảng</p>
              </div>
              <div className="p-5 space-y-3 flex-1 bg-gray-50/20">
                {MONTHLY_GOALS.map(renderGoalCard)}
                <button className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-xs font-medium text-gray-500 hover:bg-white hover:border-gray-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1">
                  <Plus size={13} /> Thêm mục tiêu tháng
                </button>
              </div>
            </div>

            {/* Năm */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  Mục tiêu Năm
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Kết quả dài hạn</p>
              </div>
              <div className="p-5 space-y-3 flex-1 bg-gray-50/20">
                {YEARLY_GOALS.map(renderGoalCard)}
                <button className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-xs font-medium text-gray-500 hover:bg-white hover:border-gray-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1">
                  <Plus size={13} /> Thêm mục tiêu năm
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}