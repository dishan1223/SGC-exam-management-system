"use client";
import { useState } from "react";
import axios from "axios";

const dummyExams = [
  { _id: "1", name: "1st Term Exam", class: 11, session: 2025 },
  { _id: "2", name: "2nd Term Exam", class: 11, session: 2025 },
];

export default function HOME() {
  const [exams, setExams] = useState(dummyExams);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", class: "", session: "", examIdDigit: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const startNewExam = async () => {
    const { name, class: cls, session } = form;
    if (!name || !cls || !session) return alert("Fill all fields");

    setLoading(true);
    try {
      const res = await axios.post("/api/exams/new", { name, class: Number(cls), session: Number(session) });
      if (res.status === 201 || res.status === 200) {
        setExams(prev => [...prev, res.data]);
        setShowModal(false);
        setForm({ name: "", class: "", session: "", examIdDigit: 0 });
        alert(`Exam ${res.data.name} created`);
      } else {
        alert("Failed to create exam");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold mb-6">Dashboard</h1>

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Start New Exam
        </button>
      </div>

      <div className="bg-[#5BB7D8] text-white px-4 py-3 rounded-lg mb-5">
        On Going Exams
      </div>

      <div className="rounded bg-[#5BB7D8] overflow-auto max-h-[60vh]">
        {exams.length === 0 ? (
          <div className="p-4 text-center bg-white text-gray-600">No ongoing exams</div>
        ) : (
          <table className="w-full bg-white">
            <thead className="bg-[#5BB7D8] text-white">
              <tr>
                <th className="p-3 text-left">Exam Name</th>
                <th className="p-3 text-center">Class</th>
                <th className="p-3 text-center">Session</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, i) => (
                <tr key={i} className="border-t hover:bg-gray-100">
                  <td className="p-3">{exam.name}</td>
                  <td className="p-3 text-center">{exam.class}</td>
                  <td className="p-3 text-center">{exam.session}</td>
                  <td className="p-3 flex justify-end gap-2">
                    <button className="px-2 py-1 bg-green-200 text-green-700 rounded hover:bg-green-300">View</button>
                    <button className="px-2 py-1 bg-rose-200 text-rose-500 rounded hover:bg-rose-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-xl font-semibold mb-4">Start New Exam</h3>

            <div className="flex flex-col gap-3">
              {["name", "class", "session", "examIdDigit"].map(field => (
                <div key={field} className="flex flex-col">
                  <label className="mb-1 font-medium text-gray-800">{field === "name" ? "Exam Name" : field === "class" ? "Class" : field === "session" ? "Session" : "Exam ID Digit"}</label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field}
                    type={field === "name" ? "text" : "number"}
                    className="border p-2 rounded"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={startNewExam}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {loading ? "Starting..." : "Start"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
