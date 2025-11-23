"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Users, BookOpen, CheckCircle, AlertCircle } from "lucide-react";

// Capitalize subject
function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function PublishResultsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [subject, setSubject] = useState("");
  const [totalMCQ, setTotalMCQ] = useState("");
  const [totalCQ, setTotalCQ] = useState("");
  const [loading, setLoading] = useState(false);

  // Get exam list
  useEffect(() => {
    async function fetchExams() {
      try {
        const res = await axios.get("/api/exams");
        setExams(res.data || []);
      } catch (err) {
        console.log(err);
      }
    }
    fetchExams();
  }, []);

  // Get students for selected exam
  useEffect(() => {
    if (!selectedExam) return;

    async function fetchStudents() {
      try {
        const res = await axios.get(`/api/exams/one?slug=${selectedExam}`);
        setStudents(res.data?.students || []);
      } catch (err) {
        console.log(err);
      }
    }
    fetchStudents();
  }, [selectedExam]);

  // Publish results
  async function submitResults() {
    if (!subject) {
      alert("Please input subject.");
      return;
    }

    if (!selectedExam || totalMCQ === "" || totalCQ === "") {
      const confirmMissing = window.confirm(
        "Some fields are empty. Continue?"
      );
      if (!confirmMissing) return;
    }

    const confirmPublish = window.confirm("Publish these results?");
    if (!confirmPublish) return;

    setLoading(true);

    const examObj = exams.find((e) => e._id === selectedExam);

    // SINGLE SUBJECT MODE FIX — no subjectList
    const payload = students
      .filter((s) => (selectedGroup ? s.group === selectedGroup : true))
      .map((s) => {
        const mcq = Number(marks[s._id]?.mcq || 0);
        const cq = Number(marks[s._id]?.cq || 0);

        return {
          studentId: s._id,
          name: s.name,
          roll: s.roll,
          group: s.group,
          section: s.section,
          session: examObj?.session,
          exam: examObj?.name,

          subjects: [
            {
              subject: capitalizeFirstLetter(subject),
              mcq,
              cq,
              obtained: mcq + cq,
              totalMCQ: Number(totalMCQ) || 0,
              totalCQ: Number(totalCQ) || 0,
              totalMarks: (Number(totalMCQ) || 0) + (Number(totalCQ) || 0)
            }
          ]
        };
      });

    try {
      const res = await axios.post("/api/exams/publish", payload);

      if (res.status === 201) {
        alert("Results Published Successfully");

        // Reset all states (better than reload)
        setSelectedExam("");
        setSelectedGroup("");
        setStudents([]);
        setMarks({});
        setSubject("");
        setTotalMCQ("");
        setTotalCQ("");
      } else {
        alert("Failed to publish results");
      }
    } catch (err) {
      console.log(err);
      alert("Error publishing results");
    }

    setLoading(false);
  }

  const filteredStudents = students
    .filter((s) => (selectedGroup ? s.group === selectedGroup : true))
    .sort((a, b) => Number(a.roll) - Number(b.roll));

  return (
    <div className="w-full px-6 py-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Publish Results</h1>
        <p className="text-sm text-gray-500 mt-1">Enter and publish exam results for students</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={16} className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
              >
                <option value="">Choose Exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.name} ({exam.session})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={16} className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">All Groups</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Common Fields */}
      {selectedExam && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subject Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter subject name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total MCQ Marks</label>
              <input
                type="number"
                placeholder="Total MCQ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={totalMCQ}
                onChange={(e) => setTotalMCQ(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total CQ Marks</label>
              <input
                type="number"
                placeholder="Total CQ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={totalCQ}
                onChange={(e) => setTotalCQ(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Students */}
      {selectedExam && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Enter Marks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MCQ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CQ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((s, i) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.roll}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.group}</td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={marks[s._id]?.mcq || ""}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [s._id]: {
                              ...marks[s._id],
                              mcq: e.target.value
                            }
                          })
                        }
                      />
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={marks[s._id]?.cq || ""}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [s._id]: {
                              ...marks[s._id],
                              cq: e.target.value
                            }
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={submitResults}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Publish Results
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}