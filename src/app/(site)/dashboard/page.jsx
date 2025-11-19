"use client";
import { useState } from "react";
import Home from "@/components/pages/Home";
import StudentsPage from "@/components/pages/StudentsPage";

export default function Dashboard() {
  const [active, setActive] = useState("home");

  const menuItems = [
    { id: "home", label: "Home" },
    { id: "students", label: "Students" },
    { id: "previous", label: "Previous Results" },
    { id: "publish", label: "Publish Results" },
  ];

  function renderPage() {
    switch (active) {
      case "home":
        return <Home />;

      case "students":
        return <StudentsPage />;

      case "previous":
        return <div>Previous Results Page Coming...</div>;

      case "publish":
        return <div>Publish Results Page Coming...</div>;

      default:
        return <Home />;
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-[250px] bg-[#EDEAEA] p-6 flex flex-col gap-6">
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
              className={`px-4 py-3 text-left rounded-lg border transition 
                ${
                  active === item.id
                    ? "bg-white border-gray-400"
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
