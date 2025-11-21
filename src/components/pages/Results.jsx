"use client";

import { useState, useEffect } from "react";
import axios from "axios";


// => this is to capitalize subject
function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export default function PublishResultsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(""); // New group filter
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [subject, setSubject] = useState("");
  const [totalMCQ, setTotalMCQ] = useState("");
  const [totalCQ, setTotalCQ] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch exams list
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

  // Fetch students for selected exam
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

  // Submit results
  async function submitResults() {
    if (!subject) {
      alert("Please input subject.");
      return;
    }

    if (!selectedExam || !totalMCQ || !totalCQ) {
      const confirmation = window.confirm(
        "Some fields are missing, still want to save?"
      );
      if (!confirmation) return;
    }

    const confirmation = window.confirm("Publish these results?");
    if (!confirmation) return;

    setLoading(true);

    // this is to get selected exam name....
    const examObj = exams.find((e) => e._id === selectedExam);
    
    const payload = students
	  .filter((s) => (selectedGroup ? s.group === selectedGroup : true))
	  .map((s) => {
	    const mcq = marks[s._id]?.mcq || 0; // default to 0
	    const cq = marks[s._id]?.cq || 0;   // default to 0

	    const mcqNum = Number(mcq);
	    const cqNum = Number(cq);

	    const totalMCQNum = totalMCQ === "" ? "" : Number(totalMCQ);
	    const totalCQNum = totalCQ === "" ? "" : Number(totalCQ);

	    return {
	    	// examObj should not be (false) but still for safety perposes, i used optional param.
	    	exam: examObj?.name || "",
        session: examObj?.session,
	      studentId: s._id,
	      name: s.name,
	      roll: s.roll,
	      group: s.group,
	      section: s.section,
	      subject: capitalizeFirstLetter(subject),
	      mcq: mcqNum,
	      cq: cqNum,
	      obtained: mcqNum + cqNum,
	      totalMCQ: totalMCQNum,
	      totalCQ: totalCQNum,
	      totalMarks:
	        totalMCQNum !== "" && totalCQNum !== "" ? totalMCQNum + totalCQNum : "",
	    };
	  });


    try {
      const res = await axios.post("/api/exams/publish", payload);

      if (res.status === 201) {
        alert("Results Published Successfully");
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
    .sort((a, b) => Number(a.examId) - Number(b.examId));

  return (
    <div className="w-full p-6">
      {/* Page Header */}
      <h2 className="text-2xl font-semibold mb-4">Publish Results</h2>

      {/* Exam + Group Filter */}
      <div className="mb-4 flex gap-4 items-center">
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
            placeholder="Total MCQ Marks"
            className="border p-2 rounded w-40"
            value={totalMCQ}
            onChange={(e) => setTotalMCQ(e.target.value)}
          />

          <input
            type="number"
            placeholder="Total CQ Marks"
            className="border p-2 rounded w-40"
            value={totalCQ}
            onChange={(e) => setTotalCQ(e.target.value)}
          />
        </div>
      )}

      {/* Students Table */}
      {selectedExam && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Enter Marks</h3>

          <div className="rounded bg-[#5BB7D8] max-h-[70vh] overflow-auto">
            <table className="w-full bg-white">
              <thead className="bg-[#5BB7D8]">
                <tr>
                  <th className="p-3 text-center text-white">Serial</th>
                  <th className="p-3 text-center text-white">Name</th>
                  <th className="p-3 text-center text-white">Exam ID</th>
                  <th className="p-3 text-center text-white">Roll</th>
                  <th className="p-3 text-center text-white">Group</th>
                  <th className="p-3 text-center text-white">MCQ</th>
                  <th className="p-3 text-center text-white">CQ</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s, i) => (
                  <tr key={s._id} className="hover:bg-gray-100">
                    <td className="px-2 border text-center border-gray-400">
                      {i + 1}
                    </td>

                    <td className="px-2 border border-gray-400">{s.name}</td>

                    <td className="px-2 border text-center border-gray-400">
                      {s.examId}
                    </td>

                    <td className="px-2 border text-center border-gray-400">
                      {s.roll}
                    </td>

                    <td className="px-2 border text-center border-gray-400">
                      {s.group}
                    </td>

                    {/* MCQ */}
                    <td className="px-2 border text-center border-gray-400">
                      <input
                        type="number"
                        className="border p-1 rounded w-20 text-center"
                        placeholder="MCQ"
                        value={marks[s._id]?.mcq || ""}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [s._id]: { ...marks[s._id], mcq: e.target.value },
                          })
                        }
                      />
                    </td>

                    {/* CQ */}
                    <td className="px-2 border text-center border-gray-400">
                      <input
                        type="number"
                        className="border p-1 rounded w-20 text-center"
                        placeholder="CQ"
                        value={marks[s._id]?.cq || ""}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [s._id]: { ...marks[s._id], cq: e.target.value },
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
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
