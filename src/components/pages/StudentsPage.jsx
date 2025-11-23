"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Trash, Plus, User, Phone, Hash, BookOpen, Users, GraduationCap } from "lucide-react";

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

  async function deleteStudent(_id, name) {
    const confirmation = window.confirm("Are you sure?");
    if (!confirmation) return;
    try {
      const res = await axios.delete("/api/students/delete", {
        data: { _id, name },
      });

      if (res.status === 200) {
        // this code deletes the student from the DOM
        setStudents(prev => prev.filter(s => s.name !== name));
        alert(`student: ${name} deleted`);
      } else if (res.status === 400) {
        alert("something went wrong. check backend logs");
      } else {
        alert("failed to delete student");
      }
    } catch (error) {
      console.log(error);
      alert("Error Deleting student: check console for error details");
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
      } else if (res.status === 500) {
        alert(res.message);
      } else if (res.status == 300) {
        alert(res.message);
      }
    } catch (err) {
      console.log(err);
    }

    e.target.reset();
    setLoading(false);
    setShowModal(false);
  }

  // this is to sort students with their roll number
  const sortedStudents = [...students].sort((a, b) => Number(a.roll) - Number(b.roll));

  return (
    <div className="w-full px-6 py-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all students in the system</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Student
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {students.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
            <p className="text-sm text-gray-500">Get started by adding a new student.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStudents.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{i + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.class}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.roll}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.section}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{s.group}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <button
                        onClick={() => deleteStudent(s._id, s.name)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Delete Student"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[450px] max-w-[90vw]">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Student</h3>
            </div>

            <form onSubmit={addStudent} className="px-6 py-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Student Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-gray-400" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter student name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Hash size={16} className="text-gray-400" />
                      </div>
                      <input
                        name="roll"
                        type="number"
                        placeholder="Roll number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-400" />
                      </div>
                      <input
                        name="phoneNumber"
                        type="number"
                        placeholder="Phone number"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Class</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen size={16} className="text-gray-400" />
                      </div>
                      <input
                        name="class"
                        type="number"
                        placeholder="Class"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <select
                      name="section"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Section</option>
                      <option value="Alpha">Alpha</option>
                      <option value="Delta">Delta</option>
                      <option value="Sigma">Sigma</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Group</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap size={16} className="text-gray-400" />
                    </div>
                    <select
                      name="group"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Group</option>
                      <option value="Science">Science</option>
                      <option value="Arts">Arts</option>
                      <option value="Commerce">Commerce</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg -mx-6 -mb-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}