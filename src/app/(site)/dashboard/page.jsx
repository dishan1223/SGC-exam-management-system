"use client";
import { useState } from "react";
import Home from "@/components/pages/Home";
import StudentsPage from "@/components/pages/StudentsPage";
import Results from "@/components/pages/Results";
import ViewResults from "@/components/pages/ViewResults";

export default function Dashboard() {
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "exams", label: "Exams" },
    { id: "students", label: "Students" },
    { id: "results", label: "Results" },
    { id: "viewResults", label: "View Results" },
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
        return <Home />;
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[250px] bg-[#eeeeee] p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold leading-6">SGC</h1>
          <p className="text-lg">Exam Dashboard</p>
          <p className="text-sm">By Ishtiaq Dishan</p>
        </div>

        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`px-4 py-3 text-left font-bold rounded-lg border transition 
                ${
                  active === item.id
                    ? "bg-[#0088cc] text-white border-gray-400"
                    : "bg-gray-300 border-transparent"
                }
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderPage()}
      </div>
    </div>
  );
}
