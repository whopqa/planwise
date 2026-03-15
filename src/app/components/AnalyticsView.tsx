import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calendar, MessageSquare, Smile, Frown, Meh } from "lucide-react";
import { DAILY_REFLECTIONS, TASKS, HABITS } from "../data/mockData";

export function AnalyticsView() {
  const [reflections] = useState(DAILY_REFLECTIONS);
  const [newReflection, setNewReflection] = useState({
    completed: "",
    obstacles: "",
    improvements: "",
    energyLevel: 7,
    mood: "good" as const
  });

  // Mock data for charts
  const weeklyProgress = [
    { day: "T2", completed: 3, total: 5, energy: 7 },
    { day: "T3", completed: 4, total: 6, energy: 8 },
    { day: "T4", completed: 2, total: 4, energy: 6 },
    { day: "T5", completed: 5, total: 7, energy: 9 },
    { day: "T6", completed: 3, total: 5, energy: 7 },
    { day: "T7", completed: 4, total: 4, energy: 8 },
    { day: "CN", completed: 2, total: 3, energy: 6 }
  ];

  const categoryData = [
    { name: "Công việc", value: 35, color: "#6366f1" },
    { name: "Học tập", value: 25, color: "#8b5cf6" },
    { name: "Sức khỏe", value: 20, color: "#10b981" },
    { name: "Gia đình", value: 15, color: "#f43f5e" },
    { name: "Tài chính", value: 5, color: "#f59e0b" }
  ];

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great": return <Smile className="w-5 h-5 text-green-500" />;
      case "good": return <Smile className="w-5 h-5 text-blue-500" />;
      case "okay": return <Meh className="w-5 h-5 text-yellow-500" />;
      case "bad": return <Frown className="w-5 h-5 text-orange-500" />;
      case "terrible": return <Frown className="w-5 h-5 text-red-500" />;
      default: return <Meh className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMoodLabel = (mood: string) => {
    const labels = {
      great: "Tuyệt vời",
      good: "Tốt",
      okay: "Bình thường", 
      bad: "Không tốt",
      terrible: "Tệ"
    };
    return labels[mood as keyof typeof labels] || mood;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tầng Đánh giá</h1>
          <p className="text-muted-foreground">Phân tích & Cải thiện hiệu suất</p>
        </div>
      </div>

      {/* Daily Reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Nhật ký cuối ngày
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hôm nay mình đã hoàn thành gì?</label>
              <Textarea
                placeholder="Liệt kê những việc đã hoàn thành..."
                value={newReflection.completed}
                onChange={(e) => setNewReflection({...newReflection, completed: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Điều gì làm mình trì hoãn?</label>
              <Textarea
                placeholder="Những trở ngại, phân tâm..."
                value={newReflection.obstacles}
                onChange={(e) => setNewReflection({...newReflection, obstacles: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Cải thiện gì cho ngày mai?</label>
              <Textarea
                placeholder="Kế hoạch cải thiện..."
                value={newReflection.improvements}
                onChange={(e) => setNewReflection({...newReflection, improvements: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Mức năng lượng:</span>
              <div className="flex gap-1">
                {[1,2,3,4,5,6,7,8,9,10].map(level => (
                  <button
                    key={level}
                    onClick={() => setNewReflection({...newReflection, energyLevel: level})}
                    className={`w-6 h-6 rounded-full text-xs ${
                      level <= newReflection.energyLevel 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Tâm trạng:</span>
              <div className="flex gap-2">
                {["great", "good", "okay", "bad", "terrible"].map(mood => (
                  <button
                    key={mood}
                    onClick={() => setNewReflection({...newReflection, mood: mood as any})}
                    className={`p-2 rounded ${
                      newReflection.mood === mood ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    {getMoodIcon(mood)}
                  </button>
                ))}
              </div>
            </div>
            
            <Button className="ml-auto">Lưu nhật ký</Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tiến độ tuần này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#6366f1" name="Hoàn thành" />
                <Bar dataKey="total" fill="#e5e7eb" name="Tổng số" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Energy Level Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Biến động năng lượng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Mức năng lượng"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ thời gian theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, value}) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Habit Streaks */}
        <Card>
          <CardHeader>
            <CardTitle>Chuỗi thói quen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {HABITS.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{habit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Hiện tại: {habit.currentStreak} ngày
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      Tốt nhất: {habit.bestStreak}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reflections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Nhật ký gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reflections.map(reflection => (
              <div key={reflection.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">
                    {new Date(reflection.date).toLocaleDateString('vi-VN')}
                  </span>
                  <div className="flex items-center gap-2">
                    {getMoodIcon(reflection.mood)}
                    <span className="text-sm">{getMoodLabel(reflection.mood)}</span>
                    <Badge variant="outline">
                      Năng lượng: {reflection.energyLevel}/10
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Hoàn thành</h5>
                    <p className="text-muted-foreground">{reflection.completed}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700 mb-1">Trở ngại</h5>
                    <p className="text-muted-foreground">{reflection.obstacles}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-700 mb-1">Cải thiện</h5>
                    <p className="text-muted-foreground">{reflection.improvements}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}