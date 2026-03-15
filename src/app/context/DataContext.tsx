import { createContext, useContext, useState, ReactNode } from "react";
import {
  CATEGORIES,
  EVENTS,
  TASKS,
  type Category,
  type CalendarEvent,
  type Task,
  type EventColor,
} from "../data/mockData";

interface DataContextType {
  categories: Category[];
  events: CalendarEvent[];
  tasks: Task[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: number, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: number) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, task: Partial<Task>) => void;
  deleteTask: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);

  const addCategory = (category: Omit<Category, "id">) => {
    const newCategory = { ...category, id: Date.now() };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: number, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
    // Update events and tasks with this category
    if (updates.color) {
      setEvents((prev) =>
        prev.map((evt) => (evt.categoryId === id ? { ...evt, color: updates.color! } : evt))
      );
      setTasks((prev) =>
        prev.map((task) => (task.categoryId === id ? { ...task, color: updates.color! } : task))
      );
    }
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Don't delete events/tasks, just set their categoryId to null or a default
    setEvents((prev) =>
      prev.map((evt) => (evt.categoryId === id ? { ...evt, categoryId: 0 } : evt))
    );
    setTasks((prev) =>
      prev.map((task) => (task.categoryId === id ? { ...task, categoryId: 0 } : task))
    );
  };

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent = { ...event, id: Date.now() };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (id: number, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt))
    );
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
  };

  const addTask = (task: Omit<Task, "id">) => {
    const newTask = { ...task, id: Date.now() };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        events,
        tasks,
        addCategory,
        updateCategory,
        deleteCategory,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
