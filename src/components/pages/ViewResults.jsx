"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ViewResults() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all exams for filters
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

  // Fetch results whenever filters change
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedExam) query.append("exam", selectedExam);
        if (selectedGroup) query.append("group", selectedGroup);
        if (selectedSession) query.append("session", selectedSession);

        const res = await axios.get(`/api/results?${query.toString()}`);
        setResults(res.data || []);
      } catch (err) {
        console.log(err);
        setResults([]);
      }
      setLoading(false);
    }

    fetchResults();
  }, [selectedExam, selectedGroup, selectedSession]);

  // Get unique sessions from exams for filter
  const sessions = [...new Set(exams.map((e) => e.session))];

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-semibold mb-4">View Results</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 items-center">
        <div>
          <label className="font-semibold">Select Exam:</label>
          <select
            className="border p-2 rounded ml-2"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">All Exams</option>
            {exams.map((exam) => (
              <option key={exam._id} value={exam.name}>
                {exam.name}
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

        <div>
          <label className="font-semibold">Select Session:</label>
          <select
            className="border p-2 rounded ml-2"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
          >
            <option value="">All Sessions</option>
            {sessions.map((session, idx) => (
              <option key={idx} value={session}>
                {session}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table */}
      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="rounded bg-[#5BB7D8] max-h-[70vh] overflow-auto">
          <table className="w-full bg-white">
            <thead className="bg-[#5BB7D8]">
              <tr>
                <th className="p-3 text-center text-white">Serial</th>
                <th className="p-3 text-center text-white">Name</th>
                <th className="p-3 text-center text-white">Exam name</th>
                <th className="p-3 text-center text-white">Roll</th>
                <th className="p-3 text-center text-white">Group</th>
                <th className="p-3 text-center text-white">Section</th>
                <th className="p-3 text-center text-white">Subject</th>
                <th className="p-3 text-center text-white">MCQ</th>
                <th className="p-3 text-center text-white">CQ</th>
                <th className="p-3 text-center text-white">Obtained</th>

              </tr>
            </thead>

            <tbody>
              {results.map((r, i) => (
                <tr key={r.studentId} className="hover:bg-gray-100">
                  <td className="px-2 border text-center border-gray-400">{i + 1}</td>
                  <td className="px-2 border border-gray-400">{r.name}</td>
                  <td className="px-2 border border-gray-400">{r.exam}</td>

                  <td className="px-2 border text-center border-gray-400">{r.roll}</td>
                  <td className="px-2 border text-center border-gray-400">{r.group}</td>
                  <td className="px-2 border text-center border-gray-400">{r.section}</td>
                  <td className="px-2 border border-gray-400">{r.subject}</td>
                  <td className="px-2 border text-center border-gray-400">{r.mcq}</td>
                  <td className="px-2 border text-center border-gray-400">{r.cq}</td>
                  <td className="px-2 border text-center border-gray-400">{r.obtained}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
