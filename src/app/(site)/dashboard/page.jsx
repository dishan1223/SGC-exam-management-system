"use client";
import { useState, useEffect } from "react";
import Home from "@/components/pages/Home";
import StudentsPage from "@/components/pages/StudentsPage";
import Results from "@/components/pages/Results";
import ViewResults from "@/components/pages/ViewResults";

export default function Dashboard() {
  // Initialize with localStorage value or default to "exams"
  const [active, setActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('activeTab') || "exams";
    }
    return "exams";
  });

  // Update localStorage when active tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeTab', active);
    }
  }, [active]);

  const menuItems = [
    { id: "exams", label: "Exams", icon: "📝" },
    { id: "students", label: "Students", icon: "👥" },
    { id: "results", label: "Results", icon: "📊" },
    { id: "viewResults", label: "View Results", icon: "👁️" },
  ];

  function renderPage() {
    switch (active) {
      case "exams":
        return <Home />;

      case "students":
        return <StudentsPage />;

      case "viewResults":
        return <ViewResults />;

      case "results":
        return <Results />;

      default:
        return <Home />; // Fallback to Home if something goes wrong
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[280px] bg-white shadow-md p-6 flex flex-col gap-6 border-r border-gray-200">
        <div className="pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-slate-800">SGC</h1>
          <p className="text-lg text-slate-600 font-medium mt-1">Exam Dashboard</p>
          <p className="text-sm text-slate-500 mt-1">By Ishtiaq Dishan</p>
        </div>

        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`px-4 py-3 text-left font-medium rounded-lg transition-colors flex items-center gap-3
                ${
                  active === item.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 text-slate-700"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-blue-600 font-medium">System Status</p>
            <p className="text-xs text-slate-600 mt-1">All systems operational</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}