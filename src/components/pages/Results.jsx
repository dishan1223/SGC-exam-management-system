"use client";

import { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-4">Publish Results</h2>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="font-semibold">Select Exam:</label>
          <select
            className="border p-2 rounded ml-2"
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

        <div>
          <label className="font-semibold">Select Group:</label>
          <select
            className="border p-2 rounded ml-2"
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

      {/* Common Fields */}
      {selectedExam && (
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Subject Name"
            className="border p-2 rounded w-64"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            type="number"
            placeholder="Total MCQ"
            className="border p-2 rounded w-40"
            value={totalMCQ}
            onChange={(e) => setTotalMCQ(e.target.value)}
          />

          <input
            type="number"
            placeholder="Total CQ"
            className="border p-2 rounded w-40"
            value={totalCQ}
            onChange={(e) => setTotalCQ(e.target.value)}
          />
        </div>
      )}

      {/* Students */}
      {selectedExam && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Enter Marks</h3>

          <div className="rounded bg-[#5BB7D8] max-h-[70vh] overflow-auto">
            <table className="w-full bg-white">
              <thead className="bg-[#5BB7D8]">
                <tr>
                  <th className="p-3 text-center text-white">#</th>
                  <th className="p-3 text-center text-white">Name</th>
                  <th className="p-3 text-center text-white">Roll</th>
                  <th className="p-3 text-center text-white">Group</th>
                  <th className="p-3 text-center text-white">MCQ</th>
                  <th className="p-3 text-center text-white">CQ</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s._id} className="hover:bg-gray-100">
                    <td className="px-2 border text-center">{i + 1}</td>
                    <td className="px-2 border">{s.name}</td>
                    <td className="px-2 border text-center">{s.roll}</td>
                    <td className="px-2 border text-center">{s.group}</td>

                    <td className="px-2 border text-center">
                      <input
                        type="number"
                        className="border p-1 rounded w-20 text-center"
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

                    <td className="px-2 border text-center">
                      <input
                        type="number"
                        className="border p-1 rounded w-20 text-center"
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

          <div className="flex justify-end mt-4">
            <button
              onClick={submitResults}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Publishing..." : "Publish Results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
