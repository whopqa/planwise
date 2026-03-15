import { useState } from "react";
import {
  Plus,
  Search,
  Check,
  Trash2,
  X,
  Flag,
  Calendar,
  FolderKanban,
  AlertCircle,
  Circle,
  Edit2,
} from "lucide-react";
import { useData } from "../context/DataContext";
import { COLOR_MAP, type Task, type EventColor } from "../data/mockData";
import { FocusView } from "./FocusView";

const PRIORITY_COLORS: Record<string, string> = {
  Cao: "text-rose-600 bg-rose-50 border-rose-200",
  "Trung bình": "text-amber-600 bg-amber-50 border-amber-200",
  Thấp: "text-emerald-600 bg-emerald-50 border-emerald-200",
};

const PRIORITY_DOT: Record<string, string> = {
  Cao: "bg-rose-500",
  "Trung bình": "bg-amber-500",
  Thấp: "bg-emerald-500",
};

const EVENT_COLORS: EventColor[] = ["indigo", "blue", "emerald", "amber", "rose", "purple", "teal", "orange"];

interface TaskModalProps {
  task?: Task;
  onClose: () => void;
  onSave: (task: Omit<Task, "id"> | Task) => void;
}

function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const { categories } = useData();
  const [form, setForm] = useState({
    title: task?.title || "",
    categoryId: task?.categoryId || (categories[0]?.id || 0),
    dueDate: task?.dueDate || "",
    priority: (task?.priority || "Trung bình") as Task["priority"],
    color: task?.color || "indigo" as EventColor,
    description: task?.description || "",
    completed: task?.completed || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    
    if (task) {
      onSave({ ...task, ...form });
    } else {
      onSave({
        title: form.title,
        categoryId: form.categoryId,
        dueDate: form.dueDate || "Chưa có",
        priority: form.priority,
        completed: false,
        color: form.color,
        description: form.description,
      });
    }
    onClose();
  };

  const selectedCategory = categories.find(c => c.id === form.categoryId);

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-800">{task ? "Chỉnh sửa công việc" : "Thêm công việc mới"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Hoàn thành báo cáo"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select
                value={form.categoryId}
                onChange={(e) => {
                  const catId = parseInt(e.target.value);
                  const cat = categories.find(c => c.id === catId);
                  setForm({ ...form, categoryId: catId, color: cat?.color || form.color });
                }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hạn chót</label>
              <input
                type="text"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                placeholder="20 Th3"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mức độ ưu tiên</label>
            <div className="flex gap-2">
              {(["Cao", "Trung bình", "Thấp"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    form.priority === p ? PRIORITY_COLORS[p] : "border-gray-200 text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Thêm chi tiết..."
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {task ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onToggle,
  onDelete,
  onEdit,
}: {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}) {
  const { categories } = useData();
  const category = categories.find(c => c.id === task.categoryId);
  const colors = category ? COLOR_MAP[category.color] : COLOR_MAP[task.color];

  return (
    <div
      className={`
        group bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-sm
        transition-all duration-150 ${task.completed ? "opacity-60" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`
            mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${task.completed
              ? `bg-emerald-500 border-emerald-500`
              : "border-gray-300 hover:border-indigo-400"
            }
          `}
        >
          {task.completed && <Check size={11} className="text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0" onClick={() => !task.completed && onEdit(task)} style={{ cursor: task.completed ? 'default' : 'pointer' }}>
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm text-gray-800 leading-tight ${task.completed ? "line-through text-gray-400" : ""}`}
            >
              {task.title}
            </h4>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="text-gray-300 hover:text-indigo-500 transition-all flex-shrink-0 p-0.5"
                >
                  <Edit2 size={13} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="text-gray-300 hover:text-rose-500 transition-all flex-shrink-0 p-0.5"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {/* Category badge */}
            {category && (
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {category.name}
              </span>
            )}

            {/* Due date */}
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar size={9} />
              {task.dueDate}
            </span>

            {/* Priority */}
            <span
              className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium ${PRIORITY_COLORS[task.priority]}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

type FilterTab = "Tất cả" | "Đang làm" | "Hoàn thành" | "Tập trung";

export function TasksView() {
  const { tasks, categories, updateTask, deleteTask, addTask } = useData();
  const [filter, setFilter] = useState<FilterTab>("Tất cả");
  const [priorityFilter, setPriorityFilter] = useState<string>("Tất cả");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  const handleSaveTask = (taskData: Omit<Task, "id"> | Task) => {
    if ('id' in taskData) {
      // Editing existing task
      updateTask(taskData.id, taskData);
    } else {
      // Adding new task
      addTask(taskData);
    }
  };

  const filtered = tasks.filter((t) => {
    const matchFilter =
      filter === "Tất cả" ? true : filter === "Đang làm" ? !t.completed : t.completed;
    const matchPriority = priorityFilter === "Tất cả" ? true : t.priority === priorityFilter;
    const matchSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchPriority && matchSearch;
  });

  const pending = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;
  const highPriority = tasks.filter((t) => !t.completed && t.priority === "Cao").length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-gray-900">Công việc</h1>
          <p className="text-xs text-gray-400 mt-0.5">{pending} đang làm · {completed} hoàn thành</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus size={14} />
          Thêm công việc
        </button>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center">
            <AlertCircle size={13} className="text-rose-500" />
          </div>
          <span className="text-xs"><span className="font-semibold text-gray-800">{highPriority}</span> ưu tiên cao</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
            <Circle size={13} className="text-amber-500" />
          </div>
          <span className="text-xs"><span className="font-semibold text-gray-800">{pending}</span> đang làm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Check size={13} className="text-emerald-500" />
          </div>
          <span className="text-xs"><span className="font-semibold text-gray-800">{completed}</span> hoàn thành</span>
        </div>
        {/* Progress bar */}
        <div className="flex-1 max-w-48 ml-2">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Tiến độ</span>
            <span>{tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 flex-1 max-w-64">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm focus:outline-none flex-1 placeholder:text-gray-400"
          />
        </div>

        {/* Status tabs */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
          {(["Tất cả", "Đang làm", "Hoàn thành", "Tập trung"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1">
          <Flag size={12} className="text-gray-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs border-none bg-transparent text-gray-500 focus:outline-none cursor-pointer"
          >
            <option value="Tất cả">Tất cả mức độ</option>
            <option value="Cao">Cao</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Thấp">Thấp</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-5">
        {filter === "Tập trung" ? (
          <FocusView />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FolderKanban size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">Không có công việc nào</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              + Thêm công việc
            </button>
          </div>
        ) : (
          <>
            {/* Pending tasks */}
            {filter !== "Hoàn thành" && filtered.filter((t) => !t.completed).length > 0 && (
              <div className="mb-5">
                {filter === "Tất cả" && (
                  <h3 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2.5 px-1">
                    Đang làm ({filtered.filter((t) => !t.completed).length})
                  </h3>
                )}
                <div className="space-y-2">
                  {filtered
                    .filter((t) => !t.completed)
                    .sort((a, b) => {
                      const order = { Cao: 0, "Trung bình": 1, Thấp: 2 };
                      return order[a.priority] - order[b.priority];
                    })
                    .map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={handleDeleteTask} onEdit={setEditingTask} />
                    ))}
                </div>
              </div>
            )}

            {/* Completed tasks */}
            {filter !== "Đang làm" && filtered.filter((t) => t.completed).length > 0 && (
              <div>
                {filter === "Tất cả" && (
                  <h3 className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2.5 px-1">
                    Hoàn thành ({filtered.filter((t) => t.completed).length})
                  </h3>
                )}
                <div className="space-y-2">
                  {filtered
                    .filter((t) => t.completed)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={handleDeleteTask} onEdit={setEditingTask} />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showAddModal && (
        <TaskModal onClose={() => setShowAddModal(false)} onSave={handleSaveTask} />
      )}
      {editingTask && (
        <TaskModal task={editingTask} onClose={() => setEditingTask(null)} onSave={handleSaveTask} />
      )}
    </div>
  );
}
