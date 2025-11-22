"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ViewResults() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fetch exams for dropdown
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

  // Get unique sessions from exams
  const sessions = [...new Set(exams.map((e) => e.session))];

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedExam || !subject || !selectedSession) {
      alert("Please select exam, session, and enter subject.");
      return;
    }

    setLoading(true);

    try {
      const query = new URLSearchParams();
      query.append("exam", selectedExam);
      query.append("session", selectedSession);
      query.append("subject", subject);
      if (selectedGroup) query.append("group", selectedGroup);

      const res = await axios.get(`/api/results?${query.toString()}`);
      setResults(res.data || []);
      setShowResults(true);
    } catch (err) {
      console.log(err);
      setResults([]);
      setShowResults(false);
    }

    setLoading(false);
  }

  return (
    <div className="w-full p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-6">View Results</h2>

      {/* Form */}
      {!showResults && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md flex flex-col gap-4 w-full max-w-md"
        >
          <div>
            <label className="font-semibold">Select Exam:</label>
            <select
              className="border p-2 rounded w-full mt-1"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              <option value="">Choose Exam</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam.name}>
                  {exam.name} ({exam.session})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Select Session:</label>
            <select
              className="border p-2 rounded w-full mt-1"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">Choose Session</option>
              {sessions.map((s, idx) => (
                <option key={idx} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Enter Subject:</label>
            <input
              type="text"
              className="border p-2 rounded w-full mt-1"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Math"
            />
          </div>

          <div>
            <label className="font-semibold">Select Group (Optional):</label>
            <select
              className="border p-2 rounded w-full mt-1"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">All Groups</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded mt-2"
          >
            {loading ? "Loading..." : "View Results"}
          </button>
        </form>
      )}

      {/* Results Table */}
      {showResults && (
        <div className="mt-6 w-full max-w-5xl">
          {loading ? (
            <p>Loading results...</p>
          ) : results.length === 0 ? (
            <p>No results found for this subject.</p>
          ) : (
            <div className="rounded bg-[#5BB7D8] max-h-[70vh] overflow-auto">
              <table className="w-full bg-white">
                <thead className="bg-[#5BB7D8]">
                  <tr>
                    <th className="p-3 text-center text-white">Serial</th>
                    <th className="p-3 text-center text-white">Name</th>
                    <th className="p-3 text-center text-white">Roll</th>
                    <th className="p-3 text-center text-white">Group</th>
                    <th className="p-3 text-center text-white">Section</th>
                    <th className="p-3 text-center text-white">MCQ</th>
                    <th className="p-3 text-center text-white">CQ</th>
                    <th className="p-3 text-center text-white">Obtained</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.studentId} className="hover:bg-gray-100">
                      <td className="px-2 border text-center">{i + 1}</td>
                      <td className="px-2 border">{r.name}</td>
                      <td className="px-2 border text-center">{r.roll}</td>
                      <td className="px-2 border text-center">{r.group}</td>
                      <td className="px-2 border text-center">{r.section}</td>
                      <td className="px-2 border text-center">{r.mcq}</td>
                      <td className="px-2 border text-center">{r.cq}</td>
                      <td className="px-2 border text-center">{r.obtained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setShowResults(false)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
