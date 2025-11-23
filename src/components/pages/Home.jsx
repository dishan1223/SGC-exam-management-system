"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function HOME() {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", class: "", session: "", examIdDigit: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // get exam data from /api/exams
  useEffect(() =>{
    async function fetchExams(){
      try {
        //axios returns a promise, that's why i need to await it.
        const res = await axios.get("/api/exams");
        if(res.status===200){
          setExams(res.data ?? []);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchExams();
  }, [])

  // Delete exam
  async function deleteExam(_id){
    // confirm delete
    const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
    if(!confirmDelete) return;

    try {
      const res = await axios.delete("/api/exams/delete",{data:{_id}});
      if (res.status===200){
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      alert("error check console")
    }
  }

  const startNewExam = async () => {
    const { name, class: cls, session } = form;
    if (!name || !cls || !session) return alert("Fill all fields");

    setLoading(true);
    try {
      const res = await axios.post("/api/exams/new", { name, class: Number(cls), session: Number(session), examIdDigit: Number(form.examIdDigit) });
      if (res.status === 201 || res.status === 200) {
        setExams(prev => [...prev, res.data.exam.name]);
        setShowModal(false);
        setForm({ name: "", class: "", session: "", examIdDigit: 0 });
        window.location.reload();
      } else if(res.status === 500){
        alert(res.data.message);
      }
      else {
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
    <div className="w-full px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Exams</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all exams</p>
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Start New Exam
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {exams.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No ongoing exams</h3>
            <p className="text-sm text-gray-500">Get started by creating a new exam.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{i+1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{exam.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.class}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{exam.session}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/exam/${exam._id}`} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 hover:bg-indigo-200 hover:border-indigo-300 transition-all mr-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      View
                    </Link>
                    <button 
                      onClick={() => deleteExam(exam._id)} 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-md border border-red-200 hover:bg-red-200 hover:border-red-300 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[450px] max-w-[90vw]">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Start New Exam</h3>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                {["name", "class", "session", "examIdDigit"].map(field => (
                  <div key={field} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field === "name" ? "Exam Name" : field === "class" ? "Class" : field === "session" ? "Session" : "Exam ID Digit"}
                    </label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      placeholder={field}
                      type={field === "name" ? "text" : "number"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startNewExam}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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