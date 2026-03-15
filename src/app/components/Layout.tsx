import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { DataProvider } from "../context/DataContext";
import { Chatbot } from "./Chatbot";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Outlet />
        </div>
        <Chatbot />
      </div>
    </DataProvider>
  );
}