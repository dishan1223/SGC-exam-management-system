"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axios.get("/api/students");
        setStudents(res.data ?? []);
      } catch (err) {
        console.log(err);
      }
    }

    fetchStudents();
  }, []);

  async function deleteStudent(_id,name){
    try {
      const res = await axios.delete("/api/students/delete",{
        data: {_id,name},
      })

      if(res.status===200){
        // this code deletes the student from the DOM
        setStudents(prev => prev.filter(s => s.name !== name));
        alert(`student: ${name} deleted`)
      }else if(res.status===400){
        alert("something went wrong. check backend logs")
      }
      else{
        alert("failed to delete student")
      }
    } catch (error) {
      console.log(error);
      alert("Error Deleting student: check console for error details")
    }
    
  }

  async function addStudent(e) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const studentData = {
      name: form.get("name"),
      roll: form.get("roll"),
      phoneNumber: form.get("phoneNumber"),
      class: form.get("class"),
      section: form.get("section"),
      group: form.get("group"),
      ongoingExam : null,
      ExamId : 0,
    };

    try {
      const res = await axios.post("/api/students/new", studentData);

      // status 201 mean data created
      if (res.status === 201) {
        const created = res.data;

        
        const createdWithId = {
          ...created,
          id: created._id,
        };


        setStudents(prev => [...prev, createdWithId]);

      }else if(res.status===500){
        alert(res.message);
      }else if(res.status==300){
        alert(res.message)
      }
    } catch (err) {
      console.log(err);
    }

    e.target.reset();
    setLoading(false);
    setShowModal(false)
    
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Students</h2>

        <button
          onClick={() => setShowModal(true)}
          className="button-blue text-white px-4 py-2 rounded-lg"
        >
          Add Student
        </button>
      </div>

      {/* Students Table */}
      <div className="button-blue rounded bg-[#5BB7D8] max-h-[80vh] overflow-auto">
        <table className="w-full bg-white">
          <thead className="bg-[#5BB7D8]">
            <tr>
              <th className="p-3 text-left text-white">Name</th>
              <th className="p-3 text-left text-white">Roll</th>
              <th className="p-3 text-left text-white">Class</th>
              <th className="p-3 text-left text-white">Section</th>
              <th className="p-3 text-left text-white">Group</th>
              <th className="p-3 text-left text-white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-100">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.roll}</td>
                <td className="p-3">{s.class}</td>
                <td className="p-3">{s.section}</td>
                <td className="p-3">{s.group}</td>
                <td className="p-3 flex justify-center translate-x-[-50px]">
                  <button
                    onClick={() => deleteStudent(s._id, s.name)}
                    className="px-2 py-1 bg-rose-200 text-rose-500 font-bold rounded cursor-pointer"
                  >
                    <Trash color="#FF2056"/>
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[380px]">
            <h3 className="text-xl font-semibold mb-4">Add Student</h3>

            <form onSubmit={addStudent} className="flex flex-col gap-3">
              <input name="name" type="text" placeholder="Student Name" className="border p-2 rounded" required />

              <input name="roll" type="number" placeholder="Roll Number" className="border p-2 rounded" required />

              <input name="phoneNumber" type="number" placeholder="Phone Number" className="border p-2 rounded" required />

              <input name="class" placeholder="Class" type="number" className="border p-2 rounded" required />

              <select name="section" className="border p-2 rounded" required>
                <option value="">Select Section</option>
                <option value="Alpha">Alpha</option>
                <option value="Delta">Delta</option>
                <option value="Sigma">Sigma</option>
              </select>

              <select name="group" className="border p-2 rounded" required>
                <option value="">Select Group</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
              </select>

              <div className="flex justify-end gap-3 mt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>

                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}